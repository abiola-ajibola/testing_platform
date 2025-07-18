import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/auth";
import { useState } from "react";

const passwordMatcher =
  import.meta.env.MODE === "development"
    ? /.*/
    : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,";:#^<>/\\])[A-Za-z\d@$!%*?&.,";:#^<>/\\]{8,}/;
const schema = object({
  username: string().required("Username is required"),
  password: string()
    .matches(passwordMatcher, "Password not strong enough")
    .required("Password is required"),
});

type LoginForm = {
  username: string;
  password: string;
};

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const { setData } = useUserContext();

  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await login(data);
      if (response) {
        // Redirect to dashboard
        setData(response);
        if (response.role === "STUDENT") navigate("/student", { replace: true });
        else navigate("/admin/dashboard", { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <InputGroup
              id="username"
              className="mt-1 w-full"
              inputProps={{
                placeholder: "Enter your username",
                type: "text",
                ...register("username"),
              }}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <InputGroup
              id="password"
              className="mt-1 w-full"
              error={!!errors.password}
              helperText={errors.password?.message}
              inputProps={{
                placeholder: "Enter your password",
                type: "password",
                ...register("password"),
              }}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Login
          </Button>
          {!!errors.password && (
            <div className="text-red-600 text-sm mt-2">
              <ul className="list-disc list-inside text-red-600 space-y-0 text-xs">
                <li
                  className={
                    errors.password?.ref?.value.length > 7
                      ? "text-green-600"
                      : ""
                  }
                >
                  Password must contain at least 8 characters
                </li>
                <li
                  className={
                    /(?=.*[A-Z])/.test(errors.password?.ref?.value || "")
                      ? "text-green-600"
                      : ""
                  }
                >
                  One uppercase letter
                </li>
                <li
                  className={
                    /(?=.*[a-z])/.test(errors.password?.ref?.value || "")
                      ? "text-green-600"
                      : ""
                  }
                >
                  One lowercase letter
                </li>
                <li
                  className={
                    /(?=.*\d)/.test(errors.password?.ref?.value || "")
                      ? "text-green-600"
                      : ""
                  }
                >
                  One number
                </li>
                <li
                  className={
                    /(?=.*[@$!%*?&.,";:#^<>/\\])/.test(
                      errors.password?.ref?.value || ""
                    )
                      ? "text-green-600"
                      : ""
                  }
                >
                  One special character
                </li>
              </ul>
            </div>
          )}
        </form>
        {/* <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p> */}
      </div>
    </div>
  );
}
