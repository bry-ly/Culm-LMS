"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Loader, PlusIcon, SparkleIcon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  courseCategory,
  courseLevels,
  courseSchema,
  courseStatus,
  CourseFormValues,
} from "@/lib/zodSchemas";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useId, useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CourseCreationPage() {
  const [Pending, startTransition] = useTransition();
  const router = useRouter();
  const pricingId = useId();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema) as Resolver<CourseFormValues>,
    defaultValues: {
      title: "",
      description: "",
      filekey: "",
      isFree: false,
      price: 0,
      duration: 0,
      smallDescription: "",
      slug: "",
    },
  });

  const isFree = form.watch("isFree");
  function onSubmit(values: CourseFormValues) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateCourse(values));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold">Create Courses</h1>
      </div>
      <Card className="">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Fill in the basic information of the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Slug</FormLabel>
                    <div className="flex w-full items-center gap-2">
                      <FormControl>
                        <Input placeholder="Slug" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        className="w-fit"
                        onClick={() => {
                          const titleValue = form.getValues("title");
                          const slug = slugify(titleValue);
                          form.setValue("slug", slug, { shouldValidate: true });
                        }}
                      >
                        Generate Slug <SparkleIcon className="ml-1" size={16} />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Small Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your description"
                        className="max-h-120px"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <RichTextEditor field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filekey"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <Uploader
                        value={field.value}
                        onChange={field.onChange}
                        fileTypeAccepted="image"
                      />
                      {/*<Input placeholder="thumbnail url" {...field} />*/}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategory.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevels.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Duration"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="w-full md:col-span-2">
                      <FormLabel>Pricing Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value ? "free" : "paid"}
                          onValueChange={(value) => {
                            const isFreeValue = value === "free";
                            field.onChange(isFreeValue);
                            if (isFreeValue) {
                              form.setValue("price", 0);
                            }
                          }}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-center gap-2 rounded-md border p-4 shadow-xs outline-none">
                            <RadioGroupItem
                              value="paid"
                              id={`${pricingId}-paid`}
                              aria-describedby={`${pricingId}-paid-description`}
                              className="size-5 after:absolute after:inset-0 [&_svg]:size-3"
                            />
                            <div className="grid grow gap-1">
                              <Label
                                htmlFor={`${pricingId}-paid`}
                                className="cursor-pointer"
                              >
                                Paid Course
                              </Label>
                              <p
                                id={`${pricingId}-paid-description`}
                                className="text-muted-foreground text-xs"
                              >
                                Set a price for your course
                              </p>
                            </div>
                          </div>
                          <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-center gap-2 rounded-md border p-4 shadow-xs outline-none">
                            <RadioGroupItem
                              value="free"
                              id={`${pricingId}-free`}
                              aria-describedby={`${pricingId}-free-description`}
                              className="size-5 after:absolute after:inset-0 [&_svg]:size-3"
                            />
                            <div className="grid grow gap-1">
                              <Label
                                htmlFor={`${pricingId}-free`}
                                className="cursor-pointer"
                              >
                                Free Course
                              </Label>
                              <p
                                id={`${pricingId}-free-description`}
                                className="text-muted-foreground text-xs"
                              >
                                Make this course available for free
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isFree && (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Price (₱)</FormLabel>
                        <FormControl>
                          <Input placeholder="Price" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courseStatus.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={Pending}>
                {Pending ? (
                  <>
                    Creating...
                    <Loader className="ml-2 size-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Create Course <PlusIcon className="ml-1" size={16} />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
