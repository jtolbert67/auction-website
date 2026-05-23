import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ItemsContext } from "../contexts/ItemsContext";
import { itemStatus } from "../utils/itemStatus";
import { auth } from "../firebase/config";

let toastId = 0;

export const OutbidNotifier = () => {
  const { items } = useContext(ItemsContext);
  const prevWinning = useRef({});
  const initialized = useRef(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    const winningNow = {};
    const newlyOutbid = [];

    items.forEach((item) => {
      const bidList = Object.values(item.bids ?? {});
      const userHasBid = uid && bidList.some((b) => b.uid === uid);
      const isWinning = userHasBid && itemStatus(item).winner === uid;
      winningNow[item.id] = isWinning;
      // Fire only on the transition from winning -> not winning,
      // and never on the very first snapshot (baseline only).
      if (initialized.current && prevWinning.current[item.id] && !isWinning) {
        newlyOutbid.push(item);
      }
    });

    prevWinning.current = winningNow;
    initialized.current = true;

    if (newlyOutbid.length) {
      setToasts((prev) => [
        ...prev,
        ...newlyOutbid.map((item) => ({ id: ++toastId, title: item.title })),
      ]);
    }
  }, [items]);

  const dismiss = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div
      className="toast-container position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1100 }}
    >
      {toasts.map((t) => (
        <Toast key={t.id} title={t.title} onClose={() => dismiss(t.id)} />
      ))}
    </div>
  );
};

const Toast = ({ title, onClose }) => {
  return (
    <div
      className="toast show align-items-center text-bg-danger border-0"
      role="alert"
    >
      <div className="d-flex">
        <div className="toast-body">
          You&apos;ve been outbid on <strong>{title}</strong>!
        </div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

Toast.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
