"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { GoogleOAuthButton } from "./GoogleOAuthButton";

type LoginFormState = {
    email: string;
    password: string;
    error: string | null;
    loading: boolean;
};

const initialState: LoginFormState = {
    email: "",
    password: "",
    error: null,
    loading: false,
};

type ResponseSchema = {
    success: boolean;
    message: string;
    accessToken?: string;
}

type Action =
    | { type: "SET_EMAIL"; payload: string }
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SUBMIT_START" }
    | { type: "SUBMIT_SUCCESS" }
    | { type: "SUBMIT_FAILURE"; payload: string };

const reducer = (state: LoginFormState, action: Action) => {
    if (action.type === "SET_EMAIL") {
        return {
            ...state,
            email: action.payload,
        };
    } else if (action.type === "SET_PASSWORD") {
        return {
            ...state,
            password: action.payload,
        };
    } else if (action.type === "SUBMIT_START") {
        return {
            ...state,
            error: "",
            loading: true,
        };
    } else if (action.type === "SUBMIT_SUCCESS") {
        return {
            ...state,
            error: null,
            loading: false,
        };
    } else if (action.type === "SUBMIT_FAILURE") {
        return {
            ...state,
            error: action.payload,
            loading: false,
        };
    } else {
        return state;
    }
};

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (state.email === "" || state.password === "") {
            dispatch({
                type: "SUBMIT_FAILURE",
                payload: "Please fill out all fields",
            });
            return;
        }

        dispatch({
            type: "SUBMIT_START",
        });

        try {
            const request = {
                email: state.email,
                password: state.password,
            };

            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(request)
            });

            const responseData: ResponseSchema = await response.json();

            if(!response.ok) {
                dispatch({
                    type: "SUBMIT_FAILURE",
                    payload: responseData.message,
                });
                return;
            }

            if (responseData.success) {
                dispatch({
                    type: "SUBMIT_SUCCESS",
                }); 
                navigate("/dashboard");
            } else {
                dispatch({
                    type: "SUBMIT_FAILURE",
                    payload: responseData.message,
                });
                return
            }
        } catch (error) {
            dispatch({
                type: "SUBMIT_FAILURE",
                payload: "Something went wrong" + error,
            });
            return
        }
    };

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            {...props}
            onSubmit={handleSubmit}
        >
            <FieldGroup>
                <div>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h1 className="text-2xl font-bold mb-4">Login</h1>
                    </div>
                    <div className="flex flex-col gap-y-3">
                        <Field className="flex flex-col gap-y-1.5">
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={state.email}
                                onChange={(e) => {
                                    dispatch({
                                        type: "SET_EMAIL",
                                        payload: e.target.value,
                                    });
                                }}
                            />
                        </Field>
                        <Field className="flex flex-col gap-y-1.5">
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                            </div>
                            <Input
                                name="password"
                                id="password"
                                type="password"
                                value={state.password}
                                onChange={(e) => {
                                    dispatch({
                                        type: "SET_PASSWORD",
                                        payload: e.target.value,
                                    });
                                }}
                            />
                        </Field>
                        <Field className="mt-2">
                            <Button type="submit">
                                {state.loading ? (
                                    <div className="flex items-center gap-x-1">
                                        <Spinner />
                                        <p>Loading...</p>
                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </Field>
                    </div>
                    <div className="mt-3 text-center">
                        {state.error && (
                            <p className="text-destructive">{state.error}</p>
                        )}
                    </div>
                </div>

                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <GoogleOAuthButton/>
                    <FieldDescription className="text-center">
                        Don{"'"}t have an account?{" "}
                        <a
                            href="/register"
                            className="underline underline-offset-4"
                        >
                            Register
                        </a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    );
}
