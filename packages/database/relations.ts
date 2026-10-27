import { defineRelations } from "drizzle-orm";
import * as s from './schema/index.js'

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

    assignedTasks: r.many.tasks({
      alias: "taskAssignee",
    }),

    createdTasks: r.many.tasks({
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
    creator: r.one.users({
      from: r.projects.createdBy,
      to: r.users.id,
      alias: "projectCreator",
    }),

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

    milestones: r.many.projectMilestones(),
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

    milestones: r.many.milestones(),
  },

  milestones: {
    projectMilestone: r.one.projectMilestones({
      from: r.milestones.projectMilestoneId,
      to: r.projectMilestones.id,
    }),

    tasks: r.many.tasks(),

    payments: r.many.projectPayments(),
  },

  task: {
    milestone: r.one.milestones({
      from: r.tasks.milestoneId,
      to: r.milestones.id,
    }),

    assigner: r.one.users({
      from: r.tasks.assignedBy,
      to: r.users.id,
      alias: "taskCreator",
    }),

    assignee: r.one.users({
      from: r.tasks.assignedTo,
      to: r.users.id,
      alias: "taskAssignee",
    }),
  },

  projectPayment: {
    user: r.one.users({
      from: r.projectPayments.userId,
      to: r.users.id,
    }),

    milestone: r.one.milestones({
      from: r.projectPayments.milestoneId,
      to: r.milestones.id,
    }),
  },

  activityLog: {
    actor: r.one.users({
      from: r.activityLogs.actorId,
      to: r.users.id,
    }),
  },
}));