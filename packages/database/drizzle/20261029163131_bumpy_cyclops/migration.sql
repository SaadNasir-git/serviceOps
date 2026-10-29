CREATE TYPE "activity_action" AS ENUM('USER_UPDATED', 'USER_DELETED', 'WORK_CREATED', 'WORK_UPDATED', 'WORK_DELETED');--> statement-breakpoint
CREATE TYPE "milestone_status" AS ENUM('pending', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "project_milestone_status" AS ENUM('draft', 'pending_admin', 'pending_customer', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "project_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "project_status" AS ENUM('under_review', 'accepted', 'rejected', 'planning', 'canceled', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "task_status" AS ENUM('pending', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('admin', 'technician', 'customer');--> statement-breakpoint
CREATE TABLE "activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_id" uuid NOT NULL,
	"action" "activity_action" NOT NULL,
	"changes" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"project_milestone_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "milestone_status" DEFAULT 'pending'::"milestone_status" NOT NULL,
	"sequence" integer NOT NULL,
	"amount" numeric(12,2) NOT NULL,
	"currency" varchar(3) NOT NULL,
	"due_date" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_members" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_members_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"leading" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_milestone" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"project_id" uuid NOT NULL,
	"status" "project_milestone_status" DEFAULT 'draft'::"project_milestone_status" NOT NULL,
	"customer_reason" text,
	"admin_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_payment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"milestone_id" uuid NOT NULL,
	"paid_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" varchar(255) NOT NULL,
	"created_by" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"category_id" integer,
	"description" text,
	"priority" "project_priority" DEFAULT 'medium'::"project_priority" NOT NULL,
	"status" "project_status" DEFAULT 'under_review'::"project_status" NOT NULL,
	"budget_amount" numeric(12,2),
	"currency" varchar(3) NOT NULL,
	"due_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"milestone_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"assigned_to" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "task_status" DEFAULT 'pending'::"task_status" NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technicians" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"technician_id" uuid NOT NULL UNIQUE,
	"skills" text[] DEFAULT '{}'::text[] NOT NULL,
	"properties" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_device" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"last_use" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'customer'::"user_role",
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_actor_id_user_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_project_milestone_id_project_milestone_id_fkey" FOREIGN KEY ("project_milestone_id") REFERENCES "project_milestone"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "project_milestone" ADD CONSTRAINT "project_milestone_project_id_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "project_payment" ADD CONSTRAINT "project_payment_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "project_payment" ADD CONSTRAINT "project_payment_milestone_id_milestones_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_created_by_user_id_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_customer_id_user_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_category_id_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_milestone_id_milestones_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_by_user_id_fkey" FOREIGN KEY ("assigned_by") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_technician_id_user_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_device" ADD CONSTRAINT "user_device_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;