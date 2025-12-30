"use client";

import React from "react";

function statusClass(status: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("идэвхитэй")) return "badge badge-green";
  if (s.includes("идэвхигүй")) return "badge badge-gray";
  if (s.includes("засвартай")) return "badge badge-amber";
  if (s.includes("актласан")) return "badge badge-red";
  return "badge badge-blue";
}

type ATM = {
  id: number;
  atmName: string;
  serialNumber: string;
  status: string;
  fullLocation: string;
  isExpired: boolean;
};

type ModalMode = "create" | "view" | "edit" | "delete" | null;

export default function ATMTableClient({ atms }: { atms: ATM[] }) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<ModalMode>(null);
  const [selected, setSelected] = React.useState<ATM | null>(null);

  const show = (m: ModalMode, atm?: ATM) => {
    setMode(m);
    setSelected(atm ?? null);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setMode(null);
    setSelected(null);
  };

  return (
    <div className="page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="title">ATM List</h2>
            <p className="subtitle">Total: {atms.length}</p>
          </div>

          <button className="btn btn-primary" onClick={() => show("create")}>
            ➕ АТМ нэмэх
          </button>
        </div>

        <div className="table-wrap">
          <table className="cool-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th>ATM Name</th>
                <th style={{ width: 140 }}>Serial</th>
                <th style={{ width: 140 }}>Status</th>
                <th style={{ width: 120 }}>Expired</th>
                <th>Location</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {atms.map((atm) => (
                <tr key={atm.id}>
                  <td className="mono">{atm.id}</td>
                  <td className="strong">{atm.atmName}</td>
                  <td className="mono">{atm.serialNumber}</td>
                  <td>
                    <span className={statusClass(atm.status)}>{atm.status}</span>
                  </td>
                  <td>
                    <span className={atm.isExpired ? "pill pill-red" : "pill pill-green"}>
                      {atm.isExpired ? "Expired" : "OK"}
                    </span>
                  </td>
                  <td className="muted">{atm.fullLocation}</td>

                  <td>
                    <div className="actions">
                      <button className="icon-btn" title="Харах" onClick={() => show("view", atm)}>
                        👁
                      </button>
                      <button className="icon-btn" title="Засах" onClick={() => show("edit", atm)}>
                        ✏️
                      </button>
                      <button className="icon-btn delete" title="Устгах" onClick={() => show("delete", atm)}>
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal */}
      {open && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {mode === "create" && "➕ АТМ нэмэх"}
                {mode === "view" && "👁 ATM дэлгэрэнгүй"}
                {mode === "edit" && "✏️ ATM засах"}
                {mode === "delete" && "🗑 ATM устгах"}
              </div>
              <button className="modal-close" onClick={close}>
                ✖
              </button>
            </div>

            <div className="modal-body">
              {mode === "create" && (
                <div className="text-muted">
                  Энд Add form оруулна (atmName, serialNumber, status, location...)
                </div>
              )}

              {(mode === "view" || mode === "edit" || mode === "delete") && selected && (
                <div style={{ display: "grid", gap: 10 }}>
                  <div><b>ID:</b> {selected.id}</div>
                  <div><b>Name:</b> {selected.atmName}</div>
                  <div><b>Serial:</b> {selected.serialNumber}</div>
                  <div><b>Status:</b> {selected.status}</div>
                  <div><b>Expired:</b> {String(selected.isExpired)}</div>
                  <div><b>Location:</b> {selected.fullLocation}</div>

                  {mode === "edit" && (
                    <div className="text-muted">
                      Энд Edit form оруулна (input-ууд)
                    </div>
                  )}

                  {mode === "delete" && (
                    <div className="danger-box">
                      Та энэ ATM-г устгахдаа итгэлтэй байна уу?
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={close}>
                Cancel
              </button>

              {mode === "delete" && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    // TODO: delete action call here
                    alert(`Delete ATM id=${selected?.id}`);
                    close();
                  }}
                >
                  Delete
                </button>
              )}

              {(mode === "create" || mode === "edit") && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    // TODO: save action call here
                    alert(`${mode} submit`);
                    close();
                  }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
