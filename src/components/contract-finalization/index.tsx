import React, { useCallback, useEffect, useState } from "react";

import type { B2BProduct, BuyerRequest } from "../../types/b2b";
import type { Contract, GeneratedContract } from "../../types/negotiation";

interface ContractFinalizationProps {
  contract?: GeneratedContract;
  buyerRequest?: BuyerRequest;
  supplierProduct?: B2BProduct;
  onContractApproved?: (contract: Contract) => void;
  onContractRejected?: (reason: string) => void;
  className?: string;
}

interface ApprovalStatus {
  buyerApproved: boolean;
  supplierApproved: boolean;
  buyerSignature?: string;
  supplierSignature?: string;
  buyerTimestamp?: Date;
  supplierTimestamp?: Date;
  rejectionReason?: string;
}

interface ContractReview {
  section: string;
  approved: boolean;
  comments?: string;
  suggestions?: string;
}

const ContractFinalization: React.FC<ContractFinalizationProps> = ({
  contract,
  buyerRequest,
  supplierProduct,
  onContractApproved,
  onContractRejected,
  className = "",
}) => {
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>({
    buyerApproved: false,
    supplierApproved: false,
  });
  const [userRole, setUserRole] = useState<"buyer" | "supplier">("buyer");
  const [contractReviews, setContractReviews] = useState<ContractReview[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState("");
  const [contractStatus, setContractStatus] = useState<
    "draft" | "under_review" | "approved" | "rejected" | "executed"
  >("draft");
  const [rejectionReason, setRejectionReason] = useState("");

  // Initialize contract reviews based on contract sections
  useEffect(() => {
    if (contract) {
      const reviews: ContractReview[] = [
        { section: "Commercial Terms", approved: false },
        { section: "Delivery Terms", approved: false },
        { section: "Payment Terms", approved: false },
        { section: "Quality Standards", approved: false },
        { section: "Legal Clauses", approved: false },
        { section: "Warranty & Support", approved: false },
      ];
      setContractReviews(reviews);
      setContractStatus("under_review");
    }
  }, [contract]);

  // Handle section review approval
  const handleSectionReview = useCallback(
    (sectionIndex: number, approved: boolean, comments?: string) => {
      setContractReviews((prev) =>
        prev.map((review, index) =>
          index === sectionIndex ? { ...review, approved, comments } : review,
        ),
      );
    },
    [],
  );

  // Check if all sections are reviewed and approved
  const allSectionsApproved =
    contractReviews.length > 0 &&
    contractReviews.every((review) => review.approved);

  // Handle contract approval by current user
  const handleApproval = useCallback(async () => {
    if (!contract) return;

    setIsReviewing(true);

    // Simulate review process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const timestamp = new Date();
    const signature = `${userRole.toUpperCase()}_SIG_${Date.now()}`;

    setApprovalStatus((prev) => ({
      ...prev,
      [userRole === "buyer" ? "buyerApproved" : "supplierApproved"]: true,
      [userRole === "buyer" ? "buyerSignature" : "supplierSignature"]:
        signature,
      [userRole === "buyer" ? "buyerTimestamp" : "supplierTimestamp"]:
        timestamp,
    }));

    setDigitalSignature(signature);
    setIsReviewing(false);
    setShowSignatureModal(true);

    // Check if both parties have approved
    const otherPartyApproved =
      userRole === "buyer"
        ? approvalStatus.supplierApproved
        : approvalStatus.buyerApproved;
    if (otherPartyApproved) {
      setContractStatus("approved");

      // Create final contract
      const finalContract: Contract = {
        id: `contract_${Date.now()}`,
        negotiationId: contract.negotiationId,
        buyerId: buyerRequest?.buyerId || "unknown",
        supplierId: supplierProduct?.supplierId || "unknown",
        terms: contract.terms,
        status: "approved",
        createdAt: contract.generatedAt,
        approvedAt: timestamp,
        buyerSignature:
          userRole === "buyer" ? signature : approvalStatus.buyerSignature,
        supplierSignature:
          userRole === "supplier"
            ? signature
            : approvalStatus.supplierSignature,
        legalDocument: contract.legalDocument,
        executionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      onContractApproved?.(finalContract);
    }
  }, [
    contract,
    userRole,
    approvalStatus,
    buyerRequest,
    supplierProduct,
    onContractApproved,
  ]);

  // Handle contract rejection
  const handleRejection = useCallback(() => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setApprovalStatus((prev) => ({
      ...prev,
      rejectionReason,
    }));

    setContractStatus("rejected");
    onContractRejected?.(rejectionReason);
  }, [rejectionReason, onContractRejected]);

  // Simulate automatic contract execution
  const executeContract = useCallback(() => {
    if (contractStatus === "approved") {
      setContractStatus("executed");

      // Simulate contract execution processes
      setTimeout(() => {
        alert(
          "🎉 Contract has been automatically executed! Payment processing and delivery scheduling initiated.",
        );
      }, 1000);
    }
  }, [contractStatus]);

  if (!contract) {
    return (
      <div className={`contract-finalization ${className}`}>
        <div className="no-contract">
          <h3>📋 Contract Finalization</h3>
          <p>
            No contract available for review. Complete a successful negotiation
            first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`contract-finalization ${className}`}>
      <div className="finalization-header">
        <h2>📋 Contract Finalization</h2>
        <div className="contract-meta">
          <span className={`status-badge ${contractStatus}`}>
            {contractStatus.replace("_", " ").toUpperCase()}
          </span>
          <span className="contract-id">ID: {contract.negotiationId}</span>
        </div>
      </div>

      {/* Role Selector */}
      <div className="role-selector">
        <h3>Your Role:</h3>
        <div className="role-buttons">
          <button
            className={`role-btn ${userRole === "buyer" ? "active" : ""}`}
            onClick={() => setUserRole("buyer")}
          >
            🛒 Buyer
          </button>
          <button
            className={`role-btn ${userRole === "supplier" ? "active" : ""}`}
            onClick={() => setUserRole("supplier")}
          >
            🏭 Supplier
          </button>
        </div>
      </div>

      {/* Contract Summary */}
      <div className="contract-summary">
        <h3>📊 Contract Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Total Value:</strong>
            <span>
              €
              {(
                contract.terms.pricePerUnit * contract.terms.quantity
              ).toLocaleString()}
            </span>
          </div>
          <div className="summary-item">
            <strong>Quantity:</strong>
            <span>{contract.terms.quantity.toLocaleString()} units</span>
          </div>
          <div className="summary-item">
            <strong>Unit Price:</strong>
            <span>€{contract.terms.pricePerUnit.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <strong>Delivery:</strong>
            <span>{contract.terms.deliveryDays} days</span>
          </div>
          <div className="summary-item">
            <strong>Payment Terms:</strong>
            <span>{contract.terms.paymentTerms}</span>
          </div>
          <div className="summary-item">
            <strong>Warranty:</strong>
            <span>{contract.terms.warrantyMonths} months</span>
          </div>
        </div>
      </div>

      {/* Contract Review Sections */}
      <div className="contract-review">
        <h3>🔍 Contract Review</h3>
        <div className="review-sections">
          {contractReviews.map((review, index) => (
            <div
              key={review.section}
              className={`review-section ${review.approved ? "approved" : ""}`}
            >
              <div className="section-header">
                <h4>{review.section}</h4>
                <div className="approval-controls">
                  <button
                    className={`approve-btn ${review.approved ? "active" : ""}`}
                    onClick={() => handleSectionReview(index, true)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className={`reject-btn ${!review.approved && review.comments ? "active" : ""}`}
                    onClick={() => {
                      const comments = prompt("Comments for this section:");
                      if (comments) {
                        handleSectionReview(index, false, comments);
                      }
                    }}
                  >
                    ❌ Needs Review
                  </button>
                </div>
              </div>
              {review.comments && (
                <div className="section-comments">
                  <strong>Comments:</strong> {review.comments}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="review-summary">
          <p>
            <strong>Progress:</strong>{" "}
            {contractReviews.filter((r) => r.approved).length} of{" "}
            {contractReviews.length} sections approved
          </p>
          {allSectionsApproved && (
            <div className="ready-for-approval">
              ✅ All sections reviewed and approved. Ready for final approval.
            </div>
          )}
        </div>
      </div>

      {/* Approval Status */}
      <div className="approval-status">
        <h3>✍️ Approval Status</h3>
        <div className="approval-grid">
          <div
            className={`approval-item ${approvalStatus.buyerApproved ? "approved" : ""}`}
          >
            <div className="party-info">
              <span className="party-icon">🛒</span>
              <span className="party-name">Buyer</span>
            </div>
            <div className="approval-info">
              {approvalStatus.buyerApproved ? (
                <div className="approved-info">
                  <span className="status">✅ Approved</span>
                  <span className="timestamp">
                    {approvalStatus.buyerTimestamp?.toLocaleString()}
                  </span>
                  <span className="signature">
                    Signature: {approvalStatus.buyerSignature}
                  </span>
                </div>
              ) : (
                <span className="status pending">⏳ Pending</span>
              )}
            </div>
          </div>

          <div
            className={`approval-item ${approvalStatus.supplierApproved ? "approved" : ""}`}
          >
            <div className="party-info">
              <span className="party-icon">🏭</span>
              <span className="party-name">Supplier</span>
            </div>
            <div className="approval-info">
              {approvalStatus.supplierApproved ? (
                <div className="approved-info">
                  <span className="status">✅ Approved</span>
                  <span className="timestamp">
                    {approvalStatus.supplierTimestamp?.toLocaleString()}
                  </span>
                  <span className="signature">
                    Signature: {approvalStatus.supplierSignature}
                  </span>
                </div>
              ) : (
                <span className="status pending">⏳ Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {contractStatus === "under_review" && allSectionsApproved && (
          <>
            <button
              className="approve-contract-btn"
              onClick={handleApproval}
              disabled={isReviewing}
            >
              {isReviewing ? "🔄 Processing..." : `✅ Approve as ${userRole}`}
            </button>

            <div className="rejection-section">
              <textarea
                placeholder="Reason for rejection (required)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
              <button
                className="reject-contract-btn"
                onClick={handleRejection}
                disabled={!rejectionReason.trim()}
              >
                ❌ Reject Contract
              </button>
            </div>
          </>
        )}

        {contractStatus === "approved" && (
          <button className="execute-contract-btn" onClick={executeContract}>
            🚀 Execute Contract
          </button>
        )}

        {contractStatus === "rejected" && (
          <div className="rejection-info">
            <h4>❌ Contract Rejected</h4>
            <p>
              <strong>Reason:</strong> {approvalStatus.rejectionReason}
            </p>
            <button
              className="restart-negotiation-btn"
              onClick={() => window.location.reload()}
            >
              🔄 Start New Negotiation
            </button>
          </div>
        )}

        {contractStatus === "executed" && (
          <div className="execution-info">
            <h4>🎉 Contract Executed Successfully!</h4>
            <p>
              Payment processing and delivery scheduling have been initiated.
            </p>
            <div className="next-steps">
              <h5>Next Steps:</h5>
              <ul>
                <li>✅ Contract legally binding</li>
                <li>🔄 Payment processing initiated</li>
                <li>📦 Delivery scheduling in progress</li>
                <li>📧 Confirmation emails sent to both parties</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Legal Document Preview */}
      <div className="legal-document">
        <h3>📜 Legal Document</h3>
        <div className="document-preview">
          <pre>{contract.legalDocument}</pre>
        </div>
      </div>

      {/* Digital Signature Modal */}
      {showSignatureModal && (
        <div className="signature-modal">
          <div className="modal-content">
            <h3>✍️ Digital Signature Confirmed</h3>
            <p>Your digital signature has been recorded:</p>
            <div className="signature-info">
              <strong>{digitalSignature}</strong>
            </div>
            <p>This signature is legally binding and cannot be revoked.</p>
            <button
              className="close-modal-btn"
              onClick={() => setShowSignatureModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .contract-finalization {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .finalization-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--color-border-light);
        }

        .finalization-header h2 {
          margin: 0;
          color: var(--color-text-primary);
        }

        .contract-meta {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .status-badge {
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.draft {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.under_review {
          background: #cce5ff;
          color: #004085;
        }

        .status-badge.approved {
          background: #e8f5e8;
          color: #155724;
        }

        .status-badge.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.executed {
          background: var(--color-border-light);
          color: var(--color-text-primary);
        }

        .contract-id {
          font-family: monospace;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .role-selector {
          background: var(--color-background);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 25px;
        }

        .role-selector h3 {
          margin-top: 0;
          margin-bottom: 15px;
        }

        .role-buttons {
          display: flex;
          gap: 10px;
        }

        .role-btn {
          padding: 10px 20px;
          border: 2px solid var(--color-border);
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .role-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .role-btn:hover:not(.active) {
          border-color: #007bff;
        }

        .contract-summary {
          background: white;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          margin-bottom: 25px;
        }

        .contract-summary h3 {
          margin-top: 0;
          margin-bottom: 20px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
          background: var(--color-background);
          border-radius: 5px;
        }

        .contract-review {
          background: white;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          margin-bottom: 25px;
        }

        .contract-review h3 {
          margin-top: 0;
          margin-bottom: 20px;
        }

        .review-sections {
          margin-bottom: 20px;
        }

        .review-section {
          padding: 15px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }

        .review-section.approved {
          background: var(--color-background);
          border-color: #28a745;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h4 {
          margin: 0;
        }

        .approval-controls {
          display: flex;
          gap: 10px;
        }

        .approve-btn,
        .reject-btn {
          padding: 5px 10px;
          border: 1px solid;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .approve-btn {
          border-color: #28a745;
          background: white;
          color: #28a745;
        }

        .approve-btn.active {
          background: #28a745;
          color: white;
        }

        .reject-btn {
          border-color: #dc3545;
          background: white;
          color: #dc3545;
        }

        .reject-btn.active {
          background: #dc3545;
          color: white;
        }

        .section-comments {
          margin-top: 10px;
          padding: 10px;
          background: #fff3cd;
          border-radius: 5px;
          font-size: 0.9rem;
        }

        .review-summary {
          padding: 15px;
          background: var(--color-background);
          border-radius: 8px;
        }

        .ready-for-approval {
          margin-top: 10px;
          padding: 10px;
          background: #e8f5e8;
          color: #155724;
          border-radius: 5px;
          font-weight: 600;
        }

        .approval-status {
          background: white;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          margin-bottom: 25px;
        }

        .approval-status h3 {
          margin-top: 0;
          margin-bottom: 20px;
        }

        .approval-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .approval-item {
          padding: 20px;
          border: 2px solid var(--color-border);
          border-radius: 10px;
          transition: all 0.2s;
        }

        .approval-item.approved {
          border-color: #28a745;
          background: var(--color-background);
        }

        .party-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .party-icon {
          font-size: 1.5rem;
        }

        .party-name {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .approved-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .status {
          font-weight: 600;
        }

        .status.pending {
          color: var(--color-text-secondary);
        }

        .timestamp {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .signature {
          font-family: monospace;
          font-size: 0.8rem;
          color: var(--color-text-primary);
        }

        .action-buttons {
          background: white;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          margin-bottom: 25px;
        }

        .approve-contract-btn {
          width: 100%;
          padding: 15px 30px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
          transition: background 0.2s;
        }

        .approve-contract-btn:hover:not(:disabled) {
          background: #218838;
        }

        .approve-contract-btn:disabled {
          background: var(--color-text-secondary);
          cursor: not-allowed;
        }

        .rejection-section {
          margin-top: 20px;
        }

        .rejection-section textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--color-border);
          border-radius: 5px;
          margin-bottom: 10px;
          resize: vertical;
        }

        .reject-contract-btn {
          padding: 10px 20px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .reject-contract-btn:hover:not(:disabled) {
          background: #c82333;
        }

        .reject-contract-btn:disabled {
          background: var(--color-text-secondary);
          cursor: not-allowed;
        }

        .execute-contract-btn {
          width: 100%;
          padding: 15px 30px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .execute-contract-btn:hover {
          background: #0056b3;
        }

        .rejection-info,
        .execution-info {
          text-align: center;
          padding: 20px;
        }

        .rejection-info h4,
        .execution-info h4 {
          margin-top: 0;
        }

        .restart-negotiation-btn {
          padding: 10px 20px;
          background: var(--color-text-secondary);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 15px;
        }

        .next-steps {
          text-align: left;
          margin-top: 20px;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
        }

        .next-steps li {
          padding: 5px 0;
        }

        .legal-document {
          background: white;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }

        .legal-document h3 {
          margin-top: 0;
          margin-bottom: 20px;
        }

        .document-preview {
          background: var(--color-background);
          padding: 20px;
          border-radius: 5px;
          border: 1px solid var(--color-border);
          max-height: 400px;
          overflow-y: auto;
        }

        .document-preview pre {
          margin: 0;
          white-space: pre-wrap;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        .signature-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          width: 90%;
          text-align: center;
        }

        .modal-content h3 {
          margin-top: 0;
        }

        .signature-info {
          margin: 20px 0;
          padding: 15px;
          background: var(--color-background);
          border-radius: 5px;
          font-family: monospace;
        }

        .close-modal-btn {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .no-contract {
          text-align: center;
          padding: 40px;
          background: var(--color-background);
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .finalization-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .contract-meta {
            flex-direction: column;
            gap: 10px;
          }

          .summary-grid,
          .approval-grid {
            grid-template-columns: 1fr;
          }

          .role-buttons {
            justify-content: center;
          }

          .section-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .approval-controls {
            align-self: stretch;
          }

          .approve-btn,
          .reject-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ContractFinalization;
