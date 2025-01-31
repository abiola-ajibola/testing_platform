import { IUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/dropdown-menu";
import { InputGroup } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const schema = object({
  username: string().required("Username is required"),
  first_name: string().required("First Name is required"),
  middle_name: string().nullable(),
  last_name: string().required("Last Name is required"),
  role: string().oneOf(["STUDENT", "ADMIN"]).required("Role is required"),
});

const selectOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "STUDENT", label: "Student" },
];

// Fetch initial data from the router and pass it to the initial form state, and also for selectedOption
export function EditUser() {
  const [selectedOption, setSelectedOption] = useState<
    (typeof selectOptions)[0] | null
  >(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (
    data: Omit<IUser, "id" | "middle_name"> & { middle_name?: string | null }
  ) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 border rounded shadow"
    >
      <div className="mb-3">
        <label className="block font-medium">Username</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("username"),
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
          }}
          className="w-full border p-2 rounded"
          error={!!errors.last_name?.message}
          helperText={errors.last_name?.message}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Role</label>
        <Select
          options={selectOptions}
          onSelect={(data) => {
            setValue("role", data.value as "ADMIN" | "STUDENT");
            setSelectedOption(data);
          }}
          selectedOption={selectedOption}
        />
        <span
          className={cn(
            "text-xs",
            errors.role?.message ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {errors.role?.message}
        </span>
      </div>

      <Button type="submit">Save</Button>
    </form>
  );
}
