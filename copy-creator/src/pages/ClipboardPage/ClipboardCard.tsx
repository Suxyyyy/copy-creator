import { memo, useCallback } from "react";
import type { ClipboardRecord } from "../../types";
import { Icons } from "../../components/Icons";
import { ImageThumb } from "./ImageThumb";
import { formatTime, getFileName, TYPE_META } from "./utils";

interface ClipboardCardProps {
  record: ClipboardRecord;
  index: number;
  getTypeLabel: (type: string) => string;
  onPaste: (r: ClipboardRecord) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onThumbHover: (thumbSrc: string, rect: DOMRect) => void;
  onThumbLeave: () => void;
}

function ClipboardCardInner({
  record,
  index,
  getTypeLabel,
  onPaste,
  onDelete,
  onTogglePin,
  onThumbHover,
  onThumbLeave,
}: ClipboardCardProps) {
  const meta = TYPE_META[record.type] || TYPE_META.text;

  const handlePaste = useCallback(() => onPaste(record), [onPaste, record]);
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(record.id);
    },
    [onDelete, record.id],
  );
  const handleTogglePin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onTogglePin(record.id);
    },
    [onTogglePin, record.id],
  );

  return (
    <div
      className={`notification clipboard-card type-${record.type}${record.is_pinned ? " pinned" : ""}`}
      style={{ "--color": meta.color, "--enter-delay": index } as React.CSSProperties}
      onClick={handlePaste}
    >
      <div className="notibar" />
      <div className="noticontent">
        <div className="notititle clipboard-card-header">
          <span className="noti-type-label">
            <span className="noti-type-icon">{meta.icon}</span>
            <span className="noti-type-text">{getTypeLabel(record.type)}</span>
          </span>
          <button
            className={`card-pin-btn${record.is_pinned ? " active" : ""}`}
            onClick={handleTogglePin}
            title={record.is_pinned ? "取消置顶" : "置顶"}
          >
            {record.is_pinned ? Icons.pin : Icons.pinOutlined}
          </button>
        </div>
        <div className="notibody clipboard-card-body">
          {record.type === "image" ? (
            <ImageThumb
              record={record}
              onHover={onThumbHover}
              onLeave={onThumbLeave}
              onClick={(e) => {
                e.stopPropagation();
                onPaste(record);
              }}
            />
          ) : record.type === "link" ? (
            <span className="clipboard-link-content">{record.content}</span>
          ) : record.type === "file" ? (
            <span className="clipboard-file-content">{getFileName(record.content)}</span>
          ) : (
            <span className="clipboard-text-content">{record.content}</span>
          )}
        </div>
        <div className="notititle clipboard-card-footer">
          <span className="clipboard-card-time">{formatTime(record.created_at)}</span>
          <div className="clipboard-card-actions">
            <button className="card-delete-btn" onClick={handleDelete}>
              {Icons.delete}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ClipboardCard = memo(ClipboardCardInner);
