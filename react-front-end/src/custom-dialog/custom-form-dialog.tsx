import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Employee } from "@/employee-table/Columns";
import React, { useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Label } from "@/components/ui/label";
import FieldInfo from "./field-info";
import { useToast } from "@/components/ui/use-toast";
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import axios from "axios";
import useFetch from "@/hooks/useFetch";

type CustomFormDialogProps = {
  trigger: React.ReactNode;
  data?: Employee;
};

function FormInput({
  field,
  label,
  type,
}: {
  field: FieldApi<any, any, any, any>;
  label: string;
  type: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </div>
  );
}

function DatePickerInput({
  field,
  label,
}: {
  field: FieldApi<any, any, any, any>;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "sm:w-[225px] w-[150px] pl-3 text-left font-normal",
              !field.state.value && "text-muted-foreground"
            )}
          >
            {field.state.value ? (
              format(field.state.value, "PPP")
            ) : (
              <span>Pick a Date</span>
            )}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={field.handleChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-1-1")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FieldInfo field={field} />
    </div>
  );
}

export default function CustomFormDialog({
  trigger,
  data,
}: CustomFormDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = React.useState<ExtFile[] | undefined>([]);
  const [profilePic, setProfilePic] = React.useState<File | undefined>(
    undefined
  );
  const { refetch } = useFetch("/employees", "employees");
  const form = useForm({
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      address: data?.address || "",
      dob: data?.dob || "",
      position: data?.position || "",
      salary: data?.salary || "",
      join_date: data?.join_date || "",
    },
    onSubmit: async (props) => {
      const { value } = props;

      const numify = parseInt((value as { salary: string }).salary);
      const dobToDateString = format(
        value.dob,
        "yyyy-MM-dd hh:mm:ss"
      ).toLowerCase();
      const joinDateToDateString = format(
        value.join_date,
        "yyyy-MM-dd hh:mm:ss"
      ).toLowerCase();
      console.log(dobToDateString);

      const payload = {
        profile_picture: profilePic,
        name: value.name,
        email: value.email,
        address: value.address,
        dob: dobToDateString,
        position: value.position,
        salary: numify,
        join_date: joinDateToDateString,
      };

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/employees",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (res.status === 500) throw new Error("Server Error");
        form.reset();
        removeFile();
        refetch();

        toast({
          title: "Success",
          description: "Employee Added Successfully",
        });
      } catch (error: any) {
        console.log(error);
        toast({
          title: "Error",
          variant: "destructive",
          description: error.message,
        });
      }
    },
    validatorAdapter: zodValidator,
  });

  useEffect(() => {
    if (!file) return;
    if (file.length === 1) {
      console.log(file[0]);
      setProfilePic(file[0].file);
    }
  }, [file]);

  const removeFile = () => {
    setFile([]);
    setProfilePic(undefined);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full h-[70%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{data ? "Update" : "New Employee"}</DialogTitle>
        </DialogHeader>
        <form.Provider>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <div className="grid grid-cols-2 gap-4 py-4">
              <form.Field
                name="name"
                validators={{
                  onChange: z.string().min(3, { message: "Name is too short" }),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return !value.includes("error");
                    },
                    {
                      message: "Name should not include error",
                    }
                  ),
                }}
                children={(field) => {
                  return <FormInput label="Name" type="text" field={field} />;
                }}
              />

              <form.Field
                name="email"
                validators={{
                  onChange: z.string().email({ message: "Invalid email" }),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return !value.includes("error");
                    },
                    {
                      message: "Email should not include error",
                    }
                  ),
                }}
                children={(field) => {
                  return <FormInput label="Email" type="email" field={field} />;
                }}
              />

              <form.Field
                name="address"
                validators={{
                  onChange: z
                    .string()
                    .min(3, { message: "Address is too short" }),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return !value.includes("error");
                    },
                    {
                      message: "Address should not include error",
                    }
                  ),
                }}
                children={(field) => {
                  return (
                    <FormInput label="Address" type="text" field={field} />
                  );
                }}
              />

              <form.Field
                name="dob"
                validators={{
                  onChange: z.date(),
                }}
                children={(field) => {
                  return (
                    <DatePickerInput label="Date of birth" field={field} />
                  );
                }}
              />

              <form.Field
                name="position"
                validators={{
                  onChange: z
                    .string()
                    .min(3, { message: "Position is too short" }),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return !value.includes("error");
                    },
                    {
                      message: "Position should not include error",
                    }
                  ),
                }}
                children={(field) => {
                  return (
                    <FormInput label="Position" type="text" field={field} />
                  );
                }}
              />

              <form.Field
                name="salary"
                validators={{
                  onChange: z.string().min(5, { message: "Salary is too low" }),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return !value.includes("error");
                    },
                    {
                      message: "Salary should not include error",
                    }
                  ),
                }}
                children={(field) => {
                  return (
                    <FormInput label="Salary" type="number" field={field} />
                  );
                }}
              />

              <form.Field
                name="join_date"
                validators={{
                  onChange: z.date(),
                }}
                children={(field) => {
                  return <DatePickerInput label="Join date" field={field} />;
                }}
              />
            </div>
            <div className="flex flex-col gap-2 py-4">
              <Label>Profile Picture</Label>
              <Dropzone
                onChange={(f) => setFile(f)}
                value={file}
                accept="image/*"
                maxFileSize={5 * 1024 * 1024}
                maxFiles={1}
              >
                {file?.map((f) => (
                  <FileMosaic
                    key={f.id}
                    {...f}
                    onDelete={removeFile}
                    info
                    preview
                  />
                ))}
              </Dropzone>
            </div>
            <div className="flex justify-end pt-8">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                )}
              />
            </div>
          </form>
        </form.Provider>
      </DialogContent>
    </Dialog>
  );
}
