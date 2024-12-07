import { Button } from "@/components/ui/button";
import { CustomerForm } from "../components/CustomerForm";
import { CustomerTable } from "../components/CustomerTable";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "../lib/api";

export default function Customers() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              Add New Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Fill in the customer details below to create a new customer record.
            </DialogDescription>
            <CustomerForm onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CustomerTable customers={customers || []} />
      )}
    </div>
  );
}
