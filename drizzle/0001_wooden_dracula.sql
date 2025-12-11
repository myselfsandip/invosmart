ALTER TABLE "invoices" ALTER COLUMN "customer_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD COLUMN "name" text NOT NULL;