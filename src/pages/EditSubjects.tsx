import { subject, SubjectResponse, ICreateSubject } from "@/api/subject";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { number, object, ObjectSchema, string } from "yup";
import AsynSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { classes, ClassResponse } from "@/api/classes";
import {
  GroupBase,
  OptionsOrGroups,
  SingleValue,
} from "node_modules/react-select/dist/declarations/src";

const animatedComponents = makeAnimated();

const schema: ObjectSchema<ICreateSubject> = object({
  name: string().required("Name is required"),
  description: string().optional(),
  classId: number().required("Class is required"),
});

export function EditSubject() {
  const loaderData = useLoaderData<{
    subject: SubjectResponse | null;
    classes: ClassResponse[];
  }>();

  const _subject = loaderData?.subject;
  //   const _classes = loaderData?.classes;

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ICreateSubject>({
    defaultValues: {
      description: _subject?.description,
      name: _subject?.name,
      classId: _subject?.classId,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ICreateSubject) => {
    const response =
      id === "new"
        ? await subject.create({
            name: data.name,
            description: data.description,
            classId: data.classId,
          })
        : subject.update(Number(id), {
            name: data.name,
            description: data.description,
            classId: data.classId,
          });
    if (id === "new" && response) {
      reset();
      navigate("/_subjects");
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
      {!location.pathname.includes("view") ? (
        <>
          <div className="mb-3">
            <AsynSelect
              cacheOptions
              loadOptions={async (inputValue) => {
                const data = await classes.getMany({ name: inputValue });
                const options = data.data.classes.map((c: ClassResponse) => ({
                  value: c.id,
                  label: c.name,
                }));
                return options as unknown as OptionsOrGroups<
                  number,
                  GroupBase<number>
                >;
              }}
              defaultOptions
              placeholder="Select Class"
              defaultInputValue={_subject?.class.name}
              defaultValue={_subject?.classId}
              closeMenuOnSelect
              components={animatedComponents}
              onChange={(data: SingleValue<{ value: number }> | unknown) => {
                console.log({ data });
                setValue("classId", (data as { value: number })?.value, {
                  shouldTouch: true,
                });
              }}
            />
          </div>
          {/* <div
            className={cn(
              "text-xs",
              errors.role?.message ? "text-red-500" : "text-muted-foreground"
            )}
          >
            {errors.role?.message}
          </div> */}
          <Button type="submit">
            {id === "new" ? "Create Subject" : "Save"}
          </Button>
        </>
      ) : (
        <div className="mb-3">
          <label className="block font-medium">Class</label>
          <p className="p-2 border rounded ">
            <div className="px-3 py-1 opacity-50">{_subject?.class.name}</div>
          </p>
        </div>
      )}
    </form>
  );
}
