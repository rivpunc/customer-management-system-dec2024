import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCustomerSchema, updateCustomerSchema, type Customer } from "@db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer, updateCustomer } from "../lib/api";
import { useToast } from "@/hooks/use-toast";

type CustomerFormData = Customer & { id?: number };

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customer ? updateCustomerSchema : insertCustomerSchema),
    defaultValues: customer ? {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      age: customer.age ?? undefined,
    } : {
      name: "",
      email: "",
      age: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: customer ? updateCustomer : createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({
        title: `Customer ${customer ? "updated" : "created"} successfully`,
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      console.log('Form data:', form.getValues());
      console.log('Customer ID:', customer?.id);
      let errorMessage = `Failed to ${customer ? "update" : "create"} customer`;
      if (error instanceof Error) {
        console.log('Error details:', error.message);
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value?.toString() ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? Number(value) : undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : customer ? "Update Customer" : "Create Customer"}
        </Button>
      </form>
    </Form>
  );
}
