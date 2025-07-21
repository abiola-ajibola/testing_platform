import { question, QuestionResponse, ICreateQuestion } from "@/api/question";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FieldErrors,
  useForm,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { array, boolean, number, object, ObjectSchema, string } from "yup";
import AsynSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { subject, SubjectResponse } from "@/api/subject";
import {
  GroupBase,
  OptionsOrGroups,
  SingleValue,
} from "node_modules/react-select/dist/declarations/src";
import Compressor from "compressorjs";
import { ChangeEvent, ReactNode, useState } from "react";
import { Check, CheckCircle, HelpCircle, LoaderCircle } from "lucide-react";
import { get } from "lodash";
import { cn } from "@/lib/utils";
// import { subject } from "@/api/subject";
// import { classes, ClassResponse } from "@/api/classes";
// import {
//   GroupBase,
//   OptionsOrGroups,
//   SingleValue,
// } from "node_modules/react-select/dist/declarations/src";

const animatedComponents = makeAnimated();

const schema: ObjectSchema<ICreateQuestion> = object({
  text: string().required("Enter a question"),
  subjectId: number().required("Subject is required"),
  explanation: string().optional(),
  explanationImageUrl: string().optional(),
  imageUrl: string().optional(),
  options: array(
    object({
      text: string().optional().default(""),
      correct: boolean().optional().default(false),
      image_url: string().optional().default(""),
    })
  ).required("Options are required"),
});

type OptionType =
  | `options.${number}.text`
  | `options.${number}.correct`
  | `options.${number}.image_url`;

// const optionsLength = 5;

export function EditQuestion() {
  const [isLoading, setIsLoading] = useState(false);
  const loaderData = useLoaderData<{
    data: QuestionResponse | null;
    // classes: ClassResponse[];
  }>();
  const [uploading, setUploading] = useState<
    Partial<
      Record<keyof ICreateQuestion | `options.${number}.image_url`, boolean>
    >
  >({});

  const _question = loaderData?.data;
  //   const _classes = loaderData?.classes;
  console.log({ _question });

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    getValues,
  } = useForm<ICreateQuestion>({
    defaultValues: {
      text: _question?.text,
      subjectId: _question?.subjectId,
      explanation: _question?.explanation,
      explanationImageUrl: _question?.explanationImageUrl,
      imageUrl: _question?.imageUrl,
      options: _question?.options,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ICreateQuestion) => {
    console.log({ data });
    setIsLoading(true);
    if (!data.options?.some((option) => option.correct)) {
      setError("options", { message: "Select a correct option" });
      setIsLoading(false);
      return;
    }
    try {
      const response =
        id === "new"
          ? await question.create({
              text: data.text,
              subjectId: data.subjectId,
              explanation: data.explanation,
              explanationImageUrl: data.explanationImageUrl,
              imageUrl: data.imageUrl,
              options: data.options?.map((option) => ({
                text: option.text,
                correct: option.correct,
                image_url: option.image_url,
              })),
            })
          : question.update(Number(id), {
              text: data.text,
              subjectId: data.subjectId,
              explanation: data.explanation,
              explanationImageUrl: data.explanationImageUrl,
              imageUrl: data.imageUrl,
              options: data.options,
            });
      if (id === "new" && response) {
        reset();
        navigate("/admin/_questions");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: keyof ICreateQuestion | OptionType
  ) => {
    setUploading((state) => ({ ...state, [name]: true }));
    const body = { currentName: "" };
    const file = e.target.files?.[0];
    switch (name) {
      case "imageUrl":
        body.currentName = getValues().imageUrl || "";
        break;
      case "explanationImageUrl":
        body.currentName = getValues().explanationImageUrl || "";
        break;
      default:
        body.currentName =
          getValues().options?.[+name.split(".")[1]]?.image_url || "";
        break;
    }
    const uploadFile = async (file: File | Blob) => {
      try {
        const response = await question.updloadImage(
          file,
          body.currentName ? body : null,
          (e) => {
            console.log({ e });
          }
        );
        console.log({ response });
        setValue(name, response?.filename, {
          shouldValidate: true,
        });
      } catch (error) {
        console.error({ error });
      } finally {
        setUploading((state) => ({ ...state, [name]: false }));
      }
    };
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        new Compressor(file, {
          quality: 0.5,
          success(result) {
            if (result.size > 1024 * 1024 * 2) {
              setError("explanationImageUrl", {
                message: "Image size should be less than 2MB",
              });
              setUploading((state) => ({ ...state, [name]: false }));
              return;
            }
            console.log({ result });
            uploadFile(result);
          },
          error(err) {
            console.log({ err });
          },
        });
      } else {
        uploadFile(file);
      }
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
        <label className="block font-medium">Question</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("text"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.text?.message}
          helperText={errors.text?.message}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Question Image</label>
        <div className="flex items-center gap-2">
          <InputGroup
            inputProps={{
              type: "file",
              accept: "image/*",
              onChange: (e) => handleImageChange(e, "imageUrl"),
              disabled:
                location.pathname.includes("view") || uploading.imageUrl,
              className:
                "disabled:border-none disabled:outline-none disabled:shadow-none",
            }}
            className="w-full border p-2 rounded"
            error={!!errors.imageUrl?.message}
            helperText={errors.imageUrl?.message}
            preview={
              (_question?.imageUrl || getValues("imageUrl")) && (
                <img
                  className="mt-4"
                  src={_question?.imageUrl || getValues("imageUrl")}
                />
              )
            }
          />
          {typeof uploading.imageUrl !== "undefined" &&
            (uploading.imageUrl ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <CheckCircle className="text-green-500" />
            ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block font-medium">
          Explanation <HelpCircle className="cursor-pointer" />
        </label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register("explanation"),
            disabled: location.pathname.includes("view"),
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!errors.explanation?.message}
          helperText={errors.explanation?.message}
        />
      </div>

      <div className="mb-3">
        <label className="block font-medium">Explanation Image</label>
        <div className="flex items-center gap-2">
          <InputGroup
            inputProps={{
              type: "file",
              accept: "image/*",
              onChange: (e) => handleImageChange(e, "explanationImageUrl"),
              disabled:
                location.pathname.includes("view") ||
                uploading.explanationImageUrl,
              className:
                "disabled:border-none disabled:outline-none disabled:shadow-none",
            }}
            className="w-full border p-2 rounded"
            error={!!errors.explanationImageUrl?.message}
            helperText={errors.explanationImageUrl?.message}
            preview={
              (_question?.imageUrl || getValues("explanationImageUrl")) && (
                <img
                  className="mt-4"
                  src={
                    _question?.explanationImageUrl ||
                    getValues("explanationImageUrl")
                  }
                />
              )
            }
          />
          {typeof uploading.explanationImageUrl !== "undefined" &&
            (uploading.explanationImageUrl ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <CheckCircle className="text-green-500" />
            ))}
        </div>
      </div>

      {!location.pathname.includes("view") ? (
        <div className="mb-10">
          <AsynSelect
            className={errors.subjectId?.message ? "selectComponentError" : ""}
            cacheOptions
            loadOptions={async (inputValue) => {
              const data = await subject.getMany({ name: inputValue });
              const options = data?.data.subjects.map((c: SubjectResponse) => ({
                value: c.id,
                label: c.name,
              }));
              return options as unknown as OptionsOrGroups<
                number,
                GroupBase<number>
              >;
            }}
            defaultOptions
            placeholder="Select Subject"
            defaultInputValue={_question?.subject.name}
            defaultValue={_question?.subjectId}
            closeMenuOnSelect
            components={animatedComponents}
            onChange={(data: SingleValue<{ value: number }> | unknown) => {
              console.log({ data });
              setValue("subjectId", (data as { value: number })?.value, {
                shouldTouch: true,
              });
            }}
          />
          <div
            className={cn(
              "text-xs",
              errors.subjectId?.message ? "text-red-500" : "text-muted-foreground"
            )}
          >
            {errors.subjectId?.message}
          </div>
        </div>
      ) : (
        <div className="mb-10">
          <label className="block font-medium">Subject</label>
          <div className="p-2 border rounded ">
            <p className="px-3 py-1 opacity-50">{_question?.subject.name}</p>
          </div>
        </div>
      )}

      {id === "new"
        ? Array.from({ length: 5 }).map((_, index) => (
            <Option
              key={index}
              label={`Option ${index + 1}`}
              name={`options.${index}`}
              path={`options[${index}]`}
              disabled={location.pathname.includes("view")}
              uploading={
                uploading as Record<`options.${number}.image_url`, boolean>
              }
              error={errors}
              handleImageChange={handleImageChange}
              register={register}
              setValue={setValue}
              option={getValues(`options.${index}`)}
            />
          ))
        : _question?.options?.map((option, index) => (
            <Option
              key={index}
              label={`Option ${index + 1}`}
              name={`options.${index}`}
              path={`options[${index}]`}
              uploading={
                uploading as Record<`options.${number}.image_url`, boolean>
              }
              disabled={location.pathname.includes("view")}
              error={errors}
              defaultChecked={option.correct}
              handleImageChange={handleImageChange}
              register={register}
              setValue={setValue}
              option={getValues(`options.${index}`) || option}
            />
          ))}
      {errors.options && !location.pathname.includes("view") && (
        <>
          <div
            className={cn(
              "text-xs mb-6",
              errors.options.message ? "text-red-500" : "text-muted-foreground"
            )}
          >
            {errors.options.message}
          </div>
        </>
      )}
      {!location.pathname.includes("view") && (
        <Button disabled={isLoading} isLoading={isLoading} type="submit">
          {id === "new" ? "Create Question" : "Save"}
        </Button>
      )}
    </form>
  );
}

function Option({
  label,
  name,
  path,
  disabled,
  error,
  option,
  defaultChecked,
  uploading,
  handleImageChange,
  register,
  setValue,
}: {
  label: ReactNode;
  name: `options.${number}`;
  path: `options[${number}]`;
  disabled: boolean;
  error: FieldErrors<ICreateQuestion>;
  option?: { id?: number; text: string; image_url?: string; correct: boolean };
  defaultChecked?: boolean;
  uploading: Record<`options.${number}.image_url`, boolean>;
  handleImageChange: (
    e: ChangeEvent<HTMLInputElement>,
    name: OptionType
  ) => void;
  register: UseFormRegister<ICreateQuestion>;
  setValue: UseFormSetValue<ICreateQuestion>;
}) {
  const location = useLocation();
  const handleCheckboxChange = () => {
    const checkboxes = document.querySelectorAll(
      ".isCorrectOption__wrapper [type='radio']"
    ) as NodeListOf<HTMLInputElement>;
    checkboxes.forEach((checkbox, index) => {
      console.log({
        check: checkbox.checked,
        selected: path + ".correct",
        name,
      });
      setValue(`options.${index}.correct` as OptionType, checkbox.checked);
    });
  };
  return (
    <div className="pb-4 mb-4 border-b-4 border-black">
      <div className="mb-3">
        <label className="block font-medium">{label}</label>
        <InputGroup
          inputProps={{
            type: "text",
            ...register(`${name}.text`),
            disabled: disabled,
            className:
              "disabled:border-none disabled:outline-none disabled:shadow-none",
          }}
          className="w-full border p-2 rounded"
          error={!!get(error, name + ".text.message")}
          helperText={get(error, name + ".text.message")}
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium">{label + " image"}</label>
        <div className="flex items-center ap-2">
          <InputGroup
            inputProps={{
              type: "file",
              accept: "image/*",
              onChange: (e) => handleImageChange(e, `${name}.image_url`),
              disabled,
              className:
                "disabled:border-none disabled:outline-none disabled:shadow-none",
            }}
            className="w-full border p-2 rounded"
            error={!!get(error, name + ".image_url.message")}
            helperText={get(error, name + ".image_url.message")}
            preview={
              option?.image_url && (
                <img className="mt-4" src={option.image_url} />
              )
            }
          />
          {typeof uploading[`${name}.image_url`] !== "undefined" &&
            (uploading[`${name}.image_url`] ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <CheckCircle className="text-green-500" />
            ))}
        </div>
      </div>
      <div className="mb-3 flex isCorrectOption__wrapper items-center gap-2">
        {location.pathname.includes("/view") && option?.correct ? (
          <>
            <Check />
            <label htmlFor={name} className="block font-medium">
              Correct Option
            </label>
          </>
        ) : (
          <>
            <InputGroup
              inputProps={{
                type: "radio",
                onChange: handleCheckboxChange,
                name: "option",
                defaultChecked,
                disabled,
                id: name,
                className:
                  "disabled:border-none disabled:outline-none disabled:shadow-none",
              }}
              className="w-full border p-2 rounded basis-6"
              error={!!get(error, path + ".correct.message")}
              helperText={get(error, path + ".correct.message")}
            />
            <label htmlFor={name} className="block font-medium">
              Set Correct Option
            </label>
          </>
        )}
      </div>
    </div>
  );
}
