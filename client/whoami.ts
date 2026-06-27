type RevealPayload = { reveal?: unknown };
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function initWhoamiModal(
  doc: Document = document,
  fetchImpl: FetchLike = fetch,
): void {
  const disc = doc.getElementById("hana-disc");
  const modal = doc.getElementById("whoami-modal") as HTMLDialogElement | null;
  if (!disc || !modal) {
    return;
  }
  const form = modal.querySelector("form");
  const input = doc.getElementById("whoami-input") as HTMLInputElement | null;
  const reveal = doc.getElementById("whoami-reveal");

  const openModal = (): void => {
    if (input) {
      input.value = "";
    }
    if (typeof modal.showModal === "function") {
      try {
        modal.showModal();
      } catch {
        modal.setAttribute("open", "");
      }
    } else {
      modal.setAttribute("open", "");
    }
    input?.focus();
  };

  const closeModal = (): void => {
    if (typeof modal.close === "function") {
      try {
        modal.close();
      } catch {
        modal.removeAttribute("open");
      }
    } else {
      modal.removeAttribute("open");
    }
    disc.focus();
  };

  disc.addEventListener("click", openModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.hasAttribute("open")) {
      event.preventDefault();
      closeModal();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = input?.value ?? "";
    void submitAnswer(answer);
  });

  async function submitAnswer(answer: string): Promise<void> {
    let ok = false;
    let payload: RevealPayload = {};
    try {
      const res = await fetchImpl("/api/whoami", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      ok = res.ok;
      payload = (await res.json().catch(() => ({}))) as RevealPayload;
    } catch {
      ok = false;
    }
    closeModal();
    if (ok && typeof payload.reveal === "string") {
      if (reveal) {
        reveal.textContent = `+ ${payload.reveal}`;
      }
      doc.body.classList.add("solved");
    }
  }
}

if (typeof window !== "undefined") {
  const run = (): void => {
    initWhoamiModal();
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}
