import { defineRelations } from "drizzle-orm";
import * as s from "./schema/index.js";

export const relations = defineRelations(s, (r) => ({
  user: {
    devices: r.many.userDevices(),
    technicianProfile: r.one.technicians({
      from: r.users.id,
      to: r.technicians.technicianId,
    }),
    createdProjects: r.many.projects({
      alias: "projectCreator",
    }),
    customerProjects: r.many.projects({
      alias: "projectCustomer",
    }),
    projectMemberships: r.many.projectMembers({
      alias: "memberUser",
    }),
    assignedMemberships: r.many.projectMembers({
      alias: "memberAssigner",
    }),
    assignedTasks: r.many.projectMemberTasks({
      alias: "taskAssignee",
    }),
    createdTasks: r.many.projectMemberTasks({
      alias: "taskCreator",
    }),
    payments: r.many.projectPayments(),
    activityLogs: r.many.activityLogs(),
  },

  userDevice: {
    user: r.one.users({
      from: r.userDevices.userId,
      to: r.users.id,
    }),
  },

  technicians: {
    user: r.one.users({
      from: r.technicians.technicianId,
      to: r.users.id,
    }),
  },

  category: {
    projects: r.many.projects(),
  },

  project: {
    customer: r.one.users({
      from: r.projects.customerId,
      to: r.users.id,
      alias: "projectCustomer",
    }),
    category: r.one.categories({
      from: r.projects.categoryId,
      to: r.categories.id,
    }),
    members: r.many.projectMembers(),
    milestones: r.many.projectMilestones({
      from: r.projects.id,
      to: r.projectMilestones.projectId,
    }),
  },

  projectMembers: {
    project: r.one.projects({
      from: r.projectMembers.projectId,
      to: r.projects.id,
    }),
    user: r.one.users({
      from: r.projectMembers.userId,
      to: r.users.id,
      alias: "memberUser",
    }),
    assigner: r.one.users({
      from: r.projectMembers.assignedBy,
      to: r.users.id,
      alias: "memberAssigner",
    }),
  },

  projectMilestone: {
    project: r.one.projects({
      from: r.projectMilestones.projectId,
      to: r.projects.id,
    }),
    tasks: r.many.milestoneTasks({
      from: r.projectMilestones.id,
      to: r.milestoneTasks.projectMilestoneId,
    }),
    payments: r.many.projectPayments({
      from: r.projectMilestones.id,
      to: r.projectPayments.projectMilestoneId,
    }),
  },

  milestoneTasks: {
    projectMilestone: r.one.projectMilestones({
      from: r.milestoneTasks.projectMilestoneId,
      to: r.projectMilestones.id,
    }),
    assigner: r.one.users({
      from: r.projectMemberTasks.assignedBy,
      to: r.users.id,
      alias: "taskCreator",
    }),
    assignee: r.one.users({
      from: r.projectMemberTasks.assignedTo,
      to: r.users.id,
      alias: "taskAssignee",
    }),
  },

  projectPayment: {
    user: r.one.users({
      from: r.projectPayments.userId,
      to: r.users.id,
    }),
    projectMilestone: r.one.projectMilestones({
      from: r.projectPayments.projectMilestoneId,
      to: r.projectMilestones.id,
    }),
  },

  activityLog: {
    actor: r.one.users({
      from: r.activityLogs.actorId,
      to: r.users.id,
    }),
  },
}));