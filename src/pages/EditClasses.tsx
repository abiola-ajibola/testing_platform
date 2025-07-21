import { classes, ClassResponse, ICreateClass } from "@/api/classes";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { object, ObjectSchema, string } from "yup";

const schema: ObjectSchema<ICreateClass> = object({
  name: string().required("Name is required"),
  description: string().optional(),
});

export function EditClass() {
  const [isLoading, setIsLoading] = useState(false);
  const loaderData = useLoaderData<{
    data: ClassResponse | null;
  }>();

  const _class = loaderData?.data;

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICreateClass>({
    defaultValues: {
      description: _class?.description,
      name: _class?.name,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ICreateClass) => {
    setIsLoading(true);
    try {
      const response =
        id === "new"
          ? await classes.create({
              name: data.name,
              description: data.description,
            })
          : await classes.update(Number(id), {
              name: data.name,
              description: data.description,
            });
      if (id === "new" && response) {
        reset();
        navigate("/admin/_classes");
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
        <label className="block font-medium">Name</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("name"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.name?.message}
          helperText={errors.name?.message}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Descripiton</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("description"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.description?.message}
          helperText={errors.description?.message}
        />
      </div>
      {!location.pathname.includes("view") && (
        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          {id === "new" ? "Create Class" : "Save"}
        </Button>
      )}
    </form>
  );
}
