import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useClipboardStore, type ClipType } from "../../stores/clipboardStore";
import { usePhraseStore } from "../../stores/phraseStore";
import { useHoverSwitch } from "./useHoverSwitch";
import { HoverProgress } from "./HoverProgress";

type TabKey = "clipboard" | "phrases";

const HOVER_DELAY = 2000;
const POPUP_WIDTH = 300;
const POPUP_MAX_HEIGHT = 420;
const VIEWPORT_PADDING = 10;
const MAX_ITEMS = 30;

function calculatePopupPosition(cursorX: number, cursorY: number) {
  let left = cursorX - POPUP_WIDTH / 2;
  let top = cursorY - 30;

  if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING;
  if (top < VIEWPORT_PADDING) top = VIEWPORT_PADDING;
  if (left + POPUP_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
    left = window.innerWidth - VIEWPORT_PADDING - POPUP_WIDTH;
  }
  if (top + POPUP_MAX_HEIGHT > window.innerHeight - VIEWPORT_PADDING) {
    top = window.innerHeight - VIEWPORT_PADDING - POPUP_MAX_HEIGHT;
  }

  return { x: left, y: top };
}

export default function RadialMenu() {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<TabKey>("clipboard");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [clipboardCategory, setClipboardCategory] = useState<ClipType>("all");
  const [phraseGroupId, setPhraseGroupId] = useState<string | null>(null);

  const isRightDownRef = useRef(false);
  const visibleRef = useRef(false);
  const selectedItemIdRef = useRef<string | null>(null);
  const activeTabRef = useRef<TabKey>("clipboard");
  const clipboardCategoryRef = useRef<ClipType>("all");
  const phraseGroupIdRef = useRef<string | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => { visibleRef.current = visible; }, [visible]);
  useEffect(() => { selectedItemIdRef.current = selectedItemId; }, [selectedItemId]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { clipboardCategoryRef.current = clipboardCategory; }, [clipboardCategory]);
  useEffect(() => { phraseGroupIdRef.current = phraseGroupId; }, [phraseGroupId]);

  const handleTabSwitch = useCallback((key: string) => {
    const tab = key as TabKey;
    setActiveTab(tab);
    setSelectedItemId(null);
    selectedItemIdRef.current = null;
    if (tab === "phrases") {
      const { groups, loadPhrases } = usePhraseStore.getState();
      if (groups.length > 0) {
        const firstId = groups[0].id;
        setPhraseGroupId(firstId);
        phraseGroupIdRef.current = firstId;
        loadPhrases(firstId);
      }
    }
  }, []);

  const handleCategorySwitch = useCallback((key: string) => {
    if (activeTabRef.current === "clipboard") {
      setClipboardCategory(key as ClipType);
      clipboardCategoryRef.current = key as ClipType;
    } else {
      setPhraseGroupId(key);
      phraseGroupIdRef.current = key;
      usePhraseStore.getState().loadPhrases(key);
    }
    setSelectedItemId(null);
    selectedItemIdRef.current = null;
  }, []);

  const navSwitch = useHoverSwitch(handleTabSwitch, HOVER_DELAY);
  const categorySwitch = useHoverSwitch(handleCategorySwitch, HOVER_DELAY);

  const navEnterRef = useRef(navSwitch.handleEnter);
  navEnterRef.current = navSwitch.handleEnter;
  const navLeaveRef = useRef(navSwitch.handleLeave);
  navLeaveRef.current = navSwitch.handleLeave;
  const catEnterRef = useRef(categorySwitch.handleEnter);
  catEnterRef.current = categorySwitch.handleEnter;
  const catLeaveRef = useRef(categorySwitch.handleLeave);
  catLeaveRef.current = categorySwitch.handleLeave;

  const resetState = useCallback(() => {
    isRightDownRef.current = false;
    visibleRef.current = false;
    setVisible(false);
    setSelectedItemId(null);
    selectedItemIdRef.current = null;
    navLeaveRef.current();
    catLeaveRef.current();
  }, []);

  const updateHoverFromPoint = useCallback((cssX: number, cssY: number) => {
    const el = document.elementFromPoint(cssX, cssY);
    if (!el) {
      selectedItemIdRef.current = null;
      setSelectedItemId(null);
      navLeaveRef.current();
      catLeaveRef.current();
      return;
    }

    const itemEl = (el as HTMLElement).closest("[data-radial-item-id]");
    const navEl = (el as HTMLElement).closest("[data-radial-nav]");
    const catEl = (el as HTMLElement).closest("[data-radial-category]");

    if (itemEl) {
      const id = itemEl.getAttribute("data-radial-item-id");
      selectedItemIdRef.current = id;
      setSelectedItemId(id);
      navLeaveRef.current();
      catLeaveRef.current();
    } else if (navEl) {
      const key = navEl.getAttribute("data-radial-nav");
      if (key && key !== activeTabRef.current) {
        navEnterRef.current(key);
      } else {
        navLeaveRef.current();
      }
      catLeaveRef.current();
      selectedItemIdRef.current = null;
      setSelectedItemId(null);
    } else if (catEl) {
      const key = catEl.getAttribute("data-radial-category");
      const activeCat = activeTabRef.current === "clipboard"
        ? clipboardCategoryRef.current
        : phraseGroupIdRef.current;
      if (key && key !== activeCat) {
        catEnterRef.current(key);
      } else {
        catLeaveRef.current();
      }
      navLeaveRef.current();
      selectedItemIdRef.current = null;
      setSelectedItemId(null);
    } else {
      selectedItemIdRef.current = null;
      setSelectedItemId(null);
      navLeaveRef.current();
      catLeaveRef.current();
    }
  }, []);

  useEffect(() => {
    let unlisteners: UnlistenFn[] = [];

    const setup = async () => {
      const unDown = await listen<{ x: number; y: number }>("radial-menu-down", (e) => {
        console.log("[RadialMenu] radial-menu-down:", e.payload);
        isRightDownRef.current = true;
        startPosRef.current = { x: e.payload.x, y: e.payload.y };

        visibleRef.current = true;
        setVisible(true);
        setPopupPos(calculatePopupPosition(e.payload.x, e.payload.y));
        useClipboardStore.getState().init();
        usePhraseStore.getState().loadGroups();
      });

      const unMove = await listen<{ x: number; y: number }>("radial-menu-move", (e) => {
        if (!isRightDownRef.current) return;

        const cssX = e.payload.x;
        const cssY = e.payload.y;

        if (!visibleRef.current) {
          visibleRef.current = true;
          setVisible(true);
          setPopupPos(calculatePopupPosition(cssX, cssY));
          useClipboardStore.getState().init();
          usePhraseStore.getState().loadGroups();
        }

        updateHoverFromPoint(cssX, cssY);
      });

      const unUp = await listen("radial-menu-up", () => {
        console.log("[RadialMenu] radial-menu-up, visible:", visibleRef.current, "selected:", selectedItemIdRef.current);
        if (isRightDownRef.current) {
          if (visibleRef.current && selectedItemIdRef.current) {
            const itemId = selectedItemIdRef.current;
            const { records, pasteRecord } = useClipboardStore.getState();
            const record = records.find((r) => r.id === itemId);
            if (record) {
              pasteRecord(record);
            } else {
              const { phrases, pastePhrase } = usePhraseStore.getState();
              const phrase = phrases.find((p) => p.id === itemId);
              if (phrase) {
                pastePhrase(phrase);
              }
            }
          }
          resetState();
        }
      });

      unlisteners = [unDown, unMove, unUp];
    };

    setup();

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isRightDownRef.current || !visibleRef.current) return;

      e.preventDefault();
      e.stopPropagation();

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;

      const catContainer = (el as HTMLElement).closest("[data-radial-categories]");
      if (catContainer) {
        catContainer.scrollLeft += e.deltaY;
        return;
      }

      const listContainer = (el as HTMLElement).closest("[data-radial-list]");
      if (listContainer) {
        listContainer.scrollTop += e.deltaY;
      }
    };

    const handleBlur = () => {
      if (isRightDownRef.current) {
        resetState();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("blur", handleBlur);

    return () => {
      unlisteners.forEach((fn) => fn());
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("wheel", handleWheel);
      window.removeEventListener("blur", handleBlur);
    };
  }, [resetState, updateHoverFromPoint]);

  const clipboardStore = useClipboardStore();
  const phraseStore = usePhraseStore();

  useEffect(() => {
    if (visible && activeTab === "phrases" && !phraseGroupId && phraseStore.groups.length > 0) {
      const firstId = phraseStore.groups[0].id;
      setPhraseGroupId(firstId);
      phraseGroupIdRef.current = firstId;
      phraseStore.loadPhrases(firstId);
    }
  }, [visible, activeTab, phraseGroupId, phraseStore.groups, phraseStore.loadPhrases]);

  if (!visible) return null;

  const filteredRecords = clipboardCategory === "all"
    ? clipboardStore.records
    : clipboardStore.records.filter((r) => r.type === clipboardCategory);

  const items = activeTab === "clipboard"
    ? filteredRecords.slice(0, MAX_ITEMS).map((r) => ({
        id: r.id,
        content: r.type === "image"
          ? `[${t("clipboard.image")}]`
          : r.type === "file"
            ? r.content.replace(/\\/g, "/").split("/").pop() || r.content
            : r.content,
        type: r.type,
      }))
    : phraseStore.phrases.map((p) => ({
        id: p.id,
        content: p.content,
        type: "phrase" as string,
      }));

  const categories = activeTab === "clipboard"
    ? [
        { key: "all", label: t("clipboard.all") },
        { key: "text", label: t("clipboard.text") },
        { key: "image", label: t("clipboard.image") },
        { key: "link", label: t("clipboard.link") },
        { key: "file", label: t("clipboard.file") },
      ]
    : phraseStore.groups.map((g) => ({
        key: g.id,
        label: g.name,
      }));

  const activeCategory = activeTab === "clipboard" ? clipboardCategory : phraseGroupId;

  return (
    <div className="radial-menu-overlay">
      <div
        className="radial-menu-popup"
        style={{ left: popupPos.x, top: popupPos.y, width: POPUP_WIDTH }}
      >
        <div className="radial-menu-nav">
          {(["clipboard", "phrases"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              className={`radial-menu-nav-tab ${activeTab === tab ? "active" : ""}`}
              data-radial-nav={tab}
            >
              <span className="radial-menu-nav-label">{t(`tabs.${tab}`)}</span>
              {navSwitch.progressKey === tab && (
                <HoverProgress progress={navSwitch.progress} />
              )}
            </button>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="radial-menu-categories" data-radial-categories>
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`radial-menu-category-chip ${activeCategory === cat.key ? "active" : ""}`}
                data-radial-category={cat.key}
              >
                {cat.label}
                {categorySwitch.progressKey === cat.key && (
                  <HoverProgress progress={categorySwitch.progress} />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="radial-menu-list" data-radial-list>
          {items.length === 0 ? (
            <div className="radial-menu-empty">{t("radialMenu.empty")}</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`radial-menu-item ${selectedItemId === item.id ? "selected" : ""}`}
                data-radial-item-id={item.id}
              >
                <span className="radial-menu-item-text">
                  {item.content.length > 80
                    ? item.content.slice(0, 80) + "…"
                    : item.content}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
