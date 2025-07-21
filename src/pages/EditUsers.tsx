import { IUser } from "@/api/auth";
import { ResponseWithPagination } from "@/api/baseClients";
import { classes, ClassResponse } from "@/api/classes";
import { users } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/dropdown-menu";
import { InputGroup } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { array, number, object, ObjectSchema, ref, string } from "yup";
import AsynSelect from "react-select/async";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const schema = object({
  username: string().required("Username is required"),
  first_name: string().required("First Name is required"),
  middle_name: string().nullable(),
  password: string().nullable(),
  confirm_password: string()
    .nullable()
    .oneOf(
      [ref("password"), null],
      "Confirm Password must be same as Password"
    ),
  last_name: string().required("Last Name is required"),
  role: string().oneOf(["STUDENT", "ADMIN"]).required("Role is required"),
  classes: array(number()).default([]),
});

const selectOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "STUDENT", label: "Student" },
];

// Fetch initial data from the router and pass it to the initial form state, and also for selectedOption
export function EditUser() {
  const loaderData = useLoaderData<{
    user: { data: Omit<IUser, "password"> | null };
    classes: { data: ResponseWithPagination<{ classes: ClassResponse[] }> };
  }>();

  const user = loaderData?.user.data;
  const _classes = loaderData?.classes.data.classes;

  const [selectedOption, setSelectedOption] = useState<
    (typeof selectOptions)[0] | null
  >(
    user?.role
      ? {
          value: user.role,
          label: user.role[0] + user.role.substring(1).toLocaleLowerCase(),
        }
      : null
  );

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<Omit<IUser & { confirm_password: string }, "id">>({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      middle_name: user?.middle_name,
      role: user?.role,
      username: user?.username,
      confirm_password: undefined,
      password: undefined,
      classes: user?.classes ?? [],
    },
    resolver: yupResolver(
      schema as ObjectSchema<Omit<IUser & { confirm_password: string }, "id">>
    ),
  });

  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (
    data: Omit<IUser, "id" | "middle_name" | "password"> & {
      middle_name?: string | null;
      password?: string | null;
    }
  ) => {
    try {
      setIsLoading(true);
      const response =
        id === "new"
          ? await users.create({
              middle_name: data.middle_name ?? "",
              password: data.password!,
              first_name: data.first_name,
              last_name: data.last_name,
              role: data.role as "ADMIN" | "STUDENT",
              username: data.username,
            })
          : users.update(Number(id), {
              middle_name: data.middle_name ?? undefined,
              password: data.password || undefined,
              first_name: data.first_name,
              last_name: data.last_name,
              role: data.role as "ADMIN" | "STUDENT",
              username: data.username,
              _classes: (data.classes as number[]) || undefined,
            });
      if (id === "new" && response) {
        reset();
        navigate("/admin/_users");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.error({ invalid: errors });
      })}
      className="max-w-md mx-auto p-4 border rounded shadow"
    >
      <div className="mb-3">
        <label className="block font-medium">Username</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("username"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.username?.message}
          helperText={errors.username?.message}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">First Name</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("first_name"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.first_name?.message}
          helperText={errors.first_name?.message}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Middle Name</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("middle_name"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.middle_name?.message}
          helperText={errors.middle_name?.message}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Last Name</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("last_name"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.last_name?.message}
          helperText={errors.last_name?.message}
        />
      </div>
      {!location.pathname.includes("view") && (
        <>
          <div className="mb-3">
            <label className="block font-medium">Password</label>
            <InputGroup
              inputProps={{
                type: "password",
                ...register("password"),
              }}
              className="w-full border p-2 rounded"
              error={!!errors.password?.message}
              helperText={errors.password?.message}
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium">Connfirm Password</label>
            <InputGroup
              inputProps={{
                type: "password",
                ...register("confirm_password"),
              }}
              className="w-full border p-2 rounded"
              error={!!errors.confirm_password?.message}
              helperText={errors.confirm_password?.message}
            />
          </div>
        </>
      )}

      <div className="mb-3">
        <label className="block font-medium">Role</label>
        {!location.pathname.includes("view") ? (
          <>
            <Select
              options={selectOptions}
              onSelect={(data) => {
                setValue("role", data.value as "ADMIN" | "STUDENT");
                setSelectedOption(data);
              }}
              selectedOption={selectedOption}
              error={!!errors.role?.message}
            />
            <div
              className={cn(
                "text-xs",
                errors.role?.message ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {errors.role?.message}
            </div>
          </>
        ) : (
          <div>{user?.role}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="block font-medium">Classes</label>
        {!location.pathname.includes("view") ? (
          <>
            <AsynSelect
              cacheOptions
              // options={classes.map((c) => ({ value: c.id, label: c.name }))}
              loadOptions={async (inputValue) => {
                const data = await classes.getMany({ name: inputValue });
                return data?.data.classes.map((c: ClassResponse) => ({
                  value: c.id,
                  label: c.name,
                }))|| [];
              }}
              defaultOptions={_classes?.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              closeMenuOnSelect={false}
              components={animatedComponents}
              onChange={(data) => {
                setValue(
                  "classes",
                  data.map((d) => (d as { value: number }).value),
                  { shouldTouch: true }
                );
              }}
              isMulti
            />
            <div
              className={cn(
                "text-xs",
                errors.role?.message ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {errors.role?.message}
            </div>
          </>
        ) : (
          <div>
            {(user?.classes as ClassResponse[])?.map(
              ({ name, id }, i, self) => (
                <span key={id} className="mx-3">
                  {name} {i !== self.length - 1 && ","}
                </span>
              )
            )}
          </div>
        )}
      </div>
      {!location.pathname.includes("view") && (
        <Button isLoading={isLoading} disabled={isLoading} type="submit">
          {id === "new" ? "Create User" : "Save"}
        </Button>
      )}
    </form>
  );
}
