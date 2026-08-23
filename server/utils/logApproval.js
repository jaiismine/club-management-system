import ApprovalLog from "../models/ApprovalLog.js";

export async function logApproval({
  event,
  action,
  performedBy,
  performerRole,
  reason,
}) {
  await ApprovalLog.create({
    event,
    action,
    performedBy,
    performerRole,
    reason,
  });
}
