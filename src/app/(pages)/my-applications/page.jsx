"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bookmark,
  AlertCircle,
  X,
  Eye,
  Trash2,
  Sparkles,
  Award,
  Users,
  Check,
  ArrowLeft,
  RefreshCw,
  Info,
  Layers,
  PlusCircle,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";

const styles = `
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .page {
    --paper: #FBFBFD;
    --panel: #FFFFFF;
    --ink: #14121C;
    --ink-soft: #5B5867;
    --ink-faint: #8B889A;
    --blue: #3B6FE0;
    --blue-soft: #EAF0FE;
    --violet: #7C5CFF;
    --violet-soft: #F1EDFF;
    --emerald: #10B981;
    --emerald-soft: #ECFDF5;
    --amber: #F59E0B;
    --amber-soft: #FFFBEB;
    --rose: #EF4444;
    --rose-soft: #FEF2F2;
    --line: #E4E1EC;
    --line-strong: #D4D0E0;

    background: var(--paper);
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    -webkit-font-smoothing: antialiased;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Nav */
  .nav {
    border-bottom: 1px solid var(--line);
    background: var(--panel);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav__inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .nav__logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--blue);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(59, 111, 224, 0.25);
  }

  .nav__mark {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--ink);
  }

  .nav__mark-dot {
    color: var(--blue);
  }

  .nav__links {
    display: flex;
    gap: 24px;
    align-items: center;
    flex-shrink: 0;
  }

  .nav__links a, .nav__link-btn {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: all 0.15s ease;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav__links a:hover,
  .nav__link-btn:hover {
    color: var(--ink);
    background: #F4F3F7;
  }

  .nav__link-btn--active {
    color: var(--blue) !important;
    background: var(--blue-soft) !important;
    font-weight: 600 !important;
  }

  .nav__right {
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    flex-shrink: 0;
  }

  .nav__profile-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--panel);
    border: 1px solid var(--line);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .nav__profile-btn:hover {
    border-color: var(--line-strong);
    background: #FDFDFE;
  }

  .nav__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--blue-soft);
    color: var(--blue);
    font-weight: 700;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav__profile-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ink);
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .profile__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 240px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(20, 18, 28, 0.08);
    overflow: hidden;
    z-index: 200;
  }

  .profile__dropdown-header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--line);
    background: #FAFAFC;
  }

  .profile__dropdown-user {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
  }

  .profile__dropdown-email {
    font-size: 12px;
    color: var(--ink-soft);
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .profile__dropdown-role {
    display: inline-block;
    margin-top: 6px;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--blue);
    background: var(--blue-soft);
    padding: 2px 8px;
    border-radius: 999px;
  }

  .profile__dropdown-body {
    padding: 6px;
  }

  .profile__dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ink-soft);
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
  }

  .profile__dropdown-item:hover {
    background: #F4F3F7;
    color: var(--ink);
  }

  .profile__dropdown-divider {
    height: 1px;
    background: var(--line);
    margin: 4px 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    background: #F0EFF4;
    color: var(--ink-soft);
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
    text-decoration: none;
  }

  .btn--primary {
    background: var(--blue);
    color: #FFFFFF;
  }
  .btn--primary:hover {
    background: #2D5EC9;
    box-shadow: 0 4px 12px rgba(59, 111, 224, 0.25);
  }

  .btn--ghost {
    background: var(--panel);
    border-color: var(--line);
    color: var(--ink);
  }
  .btn--ghost:hover {
    background: #F4F3F7;
    border-color: var(--line-strong);
  }

  .btn--danger-ghost {
    background: transparent;
    border-color: var(--rose-soft);
    color: var(--rose);
  }
  .btn--danger-ghost:hover {
    background: var(--rose-soft);
  }

  /* Main container */
  .tracker-layout {
    max-width: 1240px;
    width: 100%;
    margin: 0 auto;
    padding: 32px 32px 64px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  /* Hero / Header banner */
  .tracker-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 28px 32px;
    box-shadow: 0 2px 8px rgba(20, 18, 28, 0.02);
  }

  .tracker-header__info {
    max-width: 640px;
  }

  .tracker-header__breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--ink-faint);
    margin-bottom: 10px;
  }

  .tracker-header__title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--ink);
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tracker-header__desc {
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--ink-soft);
    margin: 0;
  }

  .tracker-header__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* KPI Cards Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 16px;
  }

  .stat-card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 6px rgba(20, 18, 28, 0.02);
    transition: transform 0.15s ease, border-color 0.15s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    border-color: var(--line-strong);
  }

  .stat-card__icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-card__icon--blue {
    background: var(--blue-soft);
    color: var(--blue);
  }

  .stat-card__icon--amber {
    background: var(--amber-soft);
    color: var(--amber);
  }

  .stat-card__icon--violet {
    background: var(--violet-soft);
    color: var(--violet);
  }

  .stat-card__icon--emerald {
    background: var(--emerald-soft);
    color: var(--emerald);
  }

  .stat-card__icon--slate {
    background: #F0EFF4;
    color: var(--ink-soft);
  }

  .stat-card__value {
    font-size: 24px;
    font-weight: 800;
    color: var(--ink);
    line-height: 1.1;
  }

  .stat-card__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-soft);
    margin-top: 4px;
  }

  /* Controls Bar (Filter, Search, Sort) */
  .controls-bar {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .controls-bar__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .search-input-wrap {
    position: relative;
    flex: 1;
    min-width: 260px;
  }

  .search-input-wrap svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ink-faint);
  }

  .search-input {
    width: 100%;
    padding: 9px 14px 9px 38px;
    font-size: 13.5px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper);
    color: var(--ink);
    outline: none;
    transition: all 0.15s ease;
  }

  .search-input:focus {
    border-color: var(--blue);
    background: var(--panel);
    box-shadow: 0 0 0 3px rgba(59, 111, 224, 0.12);
  }

  .filter-select {
    padding: 9px 14px;
    font-size: 13.5px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper);
    color: var(--ink);
    cursor: pointer;
    outline: none;
  }

  .filter-select:focus {
    border-color: var(--blue);
  }

  /* Tabs */
  .status-tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .status-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: var(--panel);
    color: var(--ink-soft);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  .status-tab:hover {
    border-color: var(--line-strong);
    color: var(--ink);
  }

  .status-tab--active {
    background: var(--ink) !important;
    color: #FFFFFF !important;
    border-color: var(--ink) !important;
  }

  .status-tab--active .badge {
    background: rgba(255, 255, 255, 0.2);
    color: #FFFFFF;
  }

  /* Applications List */
  .applications-container {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .app-card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(20, 18, 28, 0.02);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .app-card:hover {
    border-color: var(--line-strong);
    box-shadow: 0 4px 14px rgba(20, 18, 28, 0.04);
  }

  .app-card__header {
    padding: 22px 24px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .app-card__lead {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
    min-width: 280px;
  }

  .company-logo {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: #F1EDFF;
    color: var(--violet);
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(124, 92, 255, 0.15);
    overflow: hidden;
  }

  .company-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .app-card__titles {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .app-card__job-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .app-card__company-line {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .app-card__company-link {
    color: var(--blue);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .app-card__company-link:hover {
    text-decoration: underline;
  }

  .app-card__pills {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    flex-wrap: wrap;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    background: var(--paper);
    color: var(--ink-soft);
    border: 1px solid var(--line);
  }

  .pill--emerald {
    background: var(--emerald-soft);
    color: var(--emerald);
    border-color: rgba(16, 185, 129, 0.2);
    font-weight: 600;
  }

  /* Status badge large */
  .status-pill-large {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .status-pill-large--applied {
    background: var(--blue-soft);
    color: var(--blue);
    border: 1px solid rgba(59, 111, 224, 0.2);
  }

  .status-pill-large--reviewing {
    background: var(--amber-soft);
    color: #D97706;
    border: 1px solid rgba(245, 158, 11, 0.25);
  }

  .status-pill-large--shortlisted {
    background: var(--violet-soft);
    color: var(--violet);
    border: 1px solid rgba(124, 92, 255, 0.25);
  }

  .status-pill-large--hired {
    background: var(--emerald-soft);
    color: var(--emerald);
    border: 1px solid rgba(16, 185, 129, 0.25);
  }

  .status-pill-large--rejected {
    background: var(--rose-soft);
    color: var(--rose);
    border: 1px solid rgba(239, 68, 68, 0.25);
  }

  /* Visual Pipeline Stepper */
  .stepper-container {
    padding: 20px 24px 24px;
    background: #FAF9FC;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .stepper-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .stepper-header__title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink-faint);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stepper-header__time {
    font-size: 12.5px;
    color: var(--ink-soft);
  }

  .stepper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    position: relative;
    gap: 12px;
  }

  @media (max-width: 768px) {
    .stepper {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }

  .step-node {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 8px;
  }

  .step-node__bar {
    height: 4px;
    border-radius: 999px;
    background: var(--line);
    margin-bottom: 8px;
    transition: background 0.2s ease;
  }

  .step-node__bar--completed {
    background: var(--emerald);
  }

  .step-node__bar--active {
    background: var(--blue);
  }

  .step-node__bar--rejected {
    background: var(--rose);
  }

  .step-node__top {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .step-node__circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
    background: var(--panel);
    border: 2px solid var(--line);
    color: var(--ink-faint);
    transition: all 0.2s ease;
  }

  .step-node__circle--completed {
    background: var(--emerald);
    border-color: var(--emerald);
    color: #FFFFFF;
  }

  .step-node__circle--active {
    background: var(--blue);
    border-color: var(--blue);
    color: #FFFFFF;
    box-shadow: 0 0 0 4px rgba(59, 111, 224, 0.15);
  }

  .step-node__circle--violet {
    background: var(--violet);
    border-color: var(--violet);
    color: #FFFFFF;
    box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.15);
  }

  .step-node__circle--rejected {
    background: var(--rose);
    border-color: var(--rose);
    color: #FFFFFF;
  }

  .step-node__label {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ink);
  }

  .step-node__desc {
    font-size: 12px;
    line-height: 1.4;
    color: var(--ink-soft);
    padding-left: 38px;
  }

  @media (max-width: 768px) {
    .step-node__bar {
      display: none;
    }
  }

  /* Card footer actions */
  .app-card__footer {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    background: var(--panel);
  }

  .app-card__meta-tags {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 12.5px;
    color: var(--ink-faint);
    flex-wrap: wrap;
  }

  .app-card__meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .app-card__action-btns {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Details Expansion Box */
  .app-card__expansion {
    padding: 24px;
    background: #FFFFFF;
    border-top: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .expansion-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    .expansion-grid {
      grid-template-columns: 1fr;
    }
  }

  .expansion-box {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .expansion-box__title {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--ink-soft);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .expansion-box__content {
    font-size: 13.5px;
    line-height: 1.6;
    color: var(--ink);
    white-space: pre-wrap;
    max-height: 220px;
    overflow-y: auto;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 72px 24px;
    background: var(--panel);
    border: 1px dashed var(--line-strong);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .empty-state__icon-wrap {
    width: 68px;
    height: 68px;
    border-radius: 20px;
    background: var(--blue-soft);
    color: var(--blue);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-state__title {
    font-size: 20px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .empty-state__subtitle {
    font-size: 14px;
    color: var(--ink-soft);
    max-width: 440px;
    margin: 0;
    line-height: 1.5;
  }

  /* Modal */
  .modal__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(20, 18, 28, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal__content {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    width: 100%;
    max-width: 540px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(20, 18, 28, 0.16);
    animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }

  .modal__header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--line);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal__title {
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .modal__body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ink-soft);
  }

  .modal__footer {
    padding: 16px 24px;
    border-top: 1px solid var(--line);
    background: #FAF9FC;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  /* Toast Notification */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--ink);
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1200;
    animation: toastSlide 0.25s ease;
  }

  @keyframes toastSlide {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .toast--success {
    border-left: 4px solid var(--emerald);
  }

  .toast--error {
    border-left: 4px solid var(--rose);
  }
`;

export default function ApplicationsTrackerPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modeFilter, setModeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  // Interaction States
  const [expandedAppId, setExpandedAppId] = useState(null);
  const [withdrawModalApp, setWithdrawModalApp] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Authenticate user & load applications
  useEffect(() => {
    let isMounted = true;

    async function initPage() {
      try {
        const authRes = await fetch("/api/auth");
        const authData = await authRes.json();

        if (!authData.authenticated || !authData.user) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("job_portal_token");
            localStorage.removeItem("job_portal_user");
          }
          router.replace("/auth");
          return;
        }

        if (isMounted) {
          setUser(authData.user);
          setAuthChecking(false);
        }

        // Fetch applications (force seeker view so we see jobs the user applied to)
        const [appsRes, savedRes] = await Promise.all([
          fetch("/api/applications?view=seeker"),
          fetch("/api/saved-jobs"),
        ]);

        const appsData = await appsRes.json();
        const savedData = await savedRes.json();

        if (isMounted) {
          if (appsData.success) {
            setApplications(appsData.applications || []);
          }
          if (savedData.success) {
            setSavedJobsCount((savedData.savedJobs || []).length);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Tracker page load error:", err);
        if (isMounted) {
          setLoading(false);
          setAuthChecking(false);
        }
      }
    }

    initPage();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {}

    if (typeof window !== "undefined") {
      localStorage.removeItem("job_portal_token");
      localStorage.removeItem("job_portal_user");
    }
    router.push("/auth");
  };

  // Handle Application Withdrawal
  const handleWithdrawApplication = async () => {
    if (!withdrawModalApp) return;
    setIsWithdrawing(true);

    try {
      const res = await fetch(`/api/applications?id=${withdrawModalApp.application_id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setApplications((prev) =>
          prev.filter((a) => a.application_id !== withdrawModalApp.application_id)
        );
        showToast("Application withdrawn successfully", "success");
        setWithdrawModalApp(null);
      } else {
        showToast(data.error || "Failed to withdraw application", "error");
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      showToast("An error occurred while withdrawing", "error");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Compute KPI metrics
  const stats = useMemo(() => {
    const total = applications.length;
    const reviewing = applications.filter(
      (a) => a.status === "APPLIED" || a.status === "REVIEWING"
    ).length;
    const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;
    const hired = applications.filter((a) => a.status === "HIRED").length;
    const rejected = applications.filter((a) => a.status === "REJECTED").length;

    const responseRate =
      total > 0
        ? Math.round(
            ((applications.filter((a) => a.status !== "APPLIED").length) / total) *
              100
          )
        : 0;

    return { total, reviewing, shortlisted, hired, rejected, responseRate };
  }, [applications]);

  // Filter & Sort Logic
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = app.job_title?.toLowerCase().includes(q);
          const matchesCompany = app.company_name?.toLowerCase().includes(q);
          const matchesLocation = app.job_location?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCompany && !matchesLocation) return false;
        }

        // Status Filter
        if (statusFilter === "IN_REVIEW") {
          if (app.status !== "APPLIED" && app.status !== "REVIEWING") return false;
        } else if (statusFilter === "SHORTLISTED") {
          if (app.status !== "SHORTLISTED") return false;
        } else if (statusFilter === "HIRED") {
          if (app.status !== "HIRED") return false;
        } else if (statusFilter === "REJECTED") {
          if (app.status !== "REJECTED") return false;
        }

        // Mode Filter
        if (modeFilter !== "ALL") {
          if (app.job_mode?.toUpperCase() !== modeFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") {
          return new Date(b.applied_at) - new Date(a.applied_at);
        }
        if (sortBy === "OLDEST") {
          return new Date(a.applied_at) - new Date(b.applied_at);
        }
        if (sortBy === "COMPANY") {
          return (a.company_name || "").localeCompare(b.company_name || "");
        }
        if (sortBy === "SALARY") {
          return (Number(b.max_salary) || 0) - (Number(a.max_salary) || 0);
        }
        return 0;
      });
  }, [applications, searchQuery, statusFilter, modeFilter, sortBy]);

  const toggleExpand = (id) => {
    setExpandedAppId((prev) => (prev === id ? null : id));
  };

  if (authChecking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBFBFD",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            color: "#5B5867",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid #E4E1EC",
              borderTopColor: "#3B6FE0",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: 500 }}>
            Loading Applications Tracker...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="page" id="applications-tracker-page">
      <style>{styles}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav__inner">
          <div className="nav__brand" onClick={() => router.push("/home")}>
            <div className="nav__logo-icon">
              <Briefcase size={20} />
            </div>
            <div className="nav__mark">
              JobPortal<span className="nav__mark-dot">.</span>
            </div>
          </div>

          <div className="nav__links">
            <button className="nav__link-btn" onClick={() => router.push("/home")}>
              Explore Jobs
            </button>
            <button
              className="nav__link-btn nav__link-btn--active"
              onClick={() => router.push("/my-applications")}
            >
              <FileText size={15} /> Applications Tracker
              {applications.length > 0 && (
                <span
                  className="badge"
                  style={{
                    background: "var(--blue)",
                    color: "#FFFFFF",
                  }}
                >
                  {applications.length}
                </span>
              )}
            </button>
            <button
              className="nav__link-btn"
              onClick={() => router.push("/home")}
              title="View saved jobs on Explore page"
            >
              <Bookmark size={15} /> Saved Jobs
              {savedJobsCount > 0 && <span className="badge">{savedJobsCount}</span>}
            </button>
          </div>

          <div className="nav__right" ref={dropdownRef}>
            <button
              className="nav__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="nav__avatar">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <span className="nav__profile-name">{user?.name || "User"}</span>
              <ChevronDown size={15} style={{ color: "var(--ink-faint)" }} />
            </button>

            {dropdownOpen && (
              <div className="profile__dropdown">
                <div className="profile__dropdown-header">
                  <div className="profile__dropdown-user">{user?.name || "User"}</div>
                  <div className="profile__dropdown-email">{user?.email || ""}</div>
                  <span className="profile__dropdown-role">{user?.role || "JOB_SEEKER"}</span>
                </div>

                <div className="profile__dropdown-body">
                  <button
                    className="profile__dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/profile");
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <User size={16} /> View Profile
                    </span>
                  </button>
                  <button
                    className="profile__dropdown-item"
                    style={{ color: "var(--blue)", fontWeight: 600 }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileText size={16} /> Applications Tracker
                    </span>
                    <span className="badge">{applications.length}</span>
                  </button>
                  <div className="profile__dropdown-divider" />
                  <button
                    className="profile__dropdown-item"
                    onClick={handleLogout}
                    style={{ color: "var(--rose)" }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <LogOut size={16} /> Sign Out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="tracker-layout">
        {/* Header Banner */}
        <section className="tracker-header">
          <div className="tracker-header__info">
            <div className="tracker-header__breadcrumbs">
              <span
                style={{ cursor: "pointer", color: "var(--blue)" }}
                onClick={() => router.push("/home")}
              >
                Dashboard
              </span>
              <ChevronRight size={14} />
              <span>Applications Tracker</span>
            </div>
            <h1 className="tracker-header__title">
              Applications Tracker
              <span
                className="badge"
                style={{
                  background: "var(--blue-soft)",
                  color: "var(--blue)",
                  fontSize: "13px",
                  padding: "4px 10px",
                }}
              >
                {applications.length} Active
              </span>
            </h1>
            <p className="tracker-header__desc">
              Track the full lifecycle of your job applications. View live hiring
              decisions, screening progress, interview milestones, and manage submitted materials.
            </p>
          </div>

          <div className="tracker-header__actions">
            <button
              className="btn btn--ghost"
              onClick={() => {
                setLoading(true);
                fetch("/api/applications?view=seeker")
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) setApplications(data.applications || []);
                    setLoading(false);
                    showToast("Applications refreshed", "success");
                  })
                  .catch(() => setLoading(false));
              }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              className="btn btn--primary"
              onClick={() => router.push("/home")}
            >
              <Search size={15} /> Find More Jobs
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--blue">
              <FileText size={22} />
            </div>
            <div>
              <div className="stat-card__value">{stats.total}</div>
              <div className="stat-card__label">Total Applications</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--amber">
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-card__value">{stats.reviewing}</div>
              <div className="stat-card__label">In Review</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--violet">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="stat-card__value">{stats.shortlisted}</div>
              <div className="stat-card__label">Shortlisted / Interview</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--emerald">
              <Award size={22} />
            </div>
            <div>
              <div className="stat-card__value">{stats.hired}</div>
              <div className="stat-card__label">Offers / Hired</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--slate">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-card__value">{stats.responseRate}%</div>
              <div className="stat-card__label">Review Rate</div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="controls-bar">
          <div className="controls-bar__top">
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by job title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--ink-faint)",
                    cursor: "pointer",
                  }}
                  onClick={() => setSearchQuery("")}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select
                className="filter-select"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
              >
                <option value="ALL">All Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>

              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="NEWEST">Newest Applied</option>
                <option value="OLDEST">Oldest Applied</option>
                <option value="COMPANY">Company Name (A-Z)</option>
                <option value="SALARY">Highest Salary</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="status-tabs">
            <button
              className={`status-tab ${statusFilter === "ALL" ? "status-tab--active" : ""}`}
              onClick={() => setStatusFilter("ALL")}
            >
              All Applications <span className="badge">{applications.length}</span>
            </button>

            <button
              className={`status-tab ${statusFilter === "IN_REVIEW" ? "status-tab--active" : ""}`}
              onClick={() => setStatusFilter("IN_REVIEW")}
            >
              In Review <span className="badge">{stats.reviewing}</span>
            </button>

            <button
              className={`status-tab ${statusFilter === "SHORTLISTED" ? "status-tab--active" : ""}`}
              onClick={() => setStatusFilter("SHORTLISTED")}
            >
              Shortlisted <span className="badge">{stats.shortlisted}</span>
            </button>

            <button
              className={`status-tab ${statusFilter === "HIRED" ? "status-tab--active" : ""}`}
              onClick={() => setStatusFilter("HIRED")}
            >
              Offers / Hired <span className="badge">{stats.hired}</span>
            </button>

            <button
              className={`status-tab ${statusFilter === "REJECTED" ? "status-tab--active" : ""}`}
              onClick={() => setStatusFilter("REJECTED")}
            >
              Archived / Rejected <span className="badge">{stats.rejected}</span>
            </button>
          </div>
        </section>

        {/* Applications List */}
        <section className="applications-container">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--ink-soft)",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  border: "3px solid #E4E1EC",
                  borderTopColor: "var(--blue)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 12px",
                }}
              />
              <span>Loading applications pipeline...</span>
            </div>
          ) : applications.length === 0 ? (
            /* User hasn't applied to any job */
            <div className="empty-state">
              <div className="empty-state__icon-wrap">
                <Briefcase size={32} />
              </div>
              <h2 className="empty-state__title">No Applications Yet</h2>
              <p className="empty-state__subtitle">
                You haven&apos;t applied to any jobs yet. When you discover and apply for roles
                on the platform, their live recruitment pipeline will appear right here.
              </p>
              <button
                className="btn btn--primary"
                style={{ marginTop: "8px" }}
                onClick={() => router.push("/home")}
              >
                <Search size={16} /> Explore Available Jobs
              </button>
            </div>
          ) : filteredApplications.length === 0 ? (
            /* Filters returned 0 results */
            <div className="empty-state">
              <div
                className="empty-state__icon-wrap"
                style={{ background: "#F4F3F7", color: "var(--ink-soft)" }}
              >
                <SlidersHorizontal size={28} />
              </div>
              <h3 className="empty-state__title">No Matching Applications</h3>
              <p className="empty-state__subtitle">
                No job applications match your current search query or status filter. Try
                resetting your search filters.
              </p>
              <button
                className="btn btn--ghost"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                  setModeFilter("ALL");
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <ApplicationTrackerCard
                key={app.application_id}
                application={app}
                isExpanded={expandedAppId === app.application_id}
                onToggleExpand={() => toggleExpand(app.application_id)}
                onRequestWithdraw={() => setWithdrawModalApp(app)}
                onExploreSimilar={() => router.push("/home")}
              />
            ))
          )}
        </section>
      </main>

      {/* Withdraw Application Confirmation Modal */}
      {withdrawModalApp && (
        <div className="modal__overlay" onClick={() => setWithdrawModalApp(null)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertCircle size={20} style={{ color: "var(--rose)" }} />
                <h3 className="modal__title">Withdraw Application</h3>
              </div>
              <button
                className="btn btn--ghost"
                style={{ padding: "6px", borderRadius: "50%", border: "none" }}
                onClick={() => setWithdrawModalApp(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal__body">
              <p style={{ margin: "0 0 12px", color: "var(--ink)" }}>
                Are you sure you want to withdraw your application for{" "}
                <strong>{withdrawModalApp.job_title}</strong> at{" "}
                <strong>{withdrawModalApp.company_name || "the employer"}</strong>?
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--ink-faint)" }}>
                This will remove your submission from the employer&apos;s active hiring queue.
                You can re-apply later if the position is still open.
              </p>
            </div>

            <div className="modal__footer">
              <button
                className="btn btn--ghost"
                disabled={isWithdrawing}
                onClick={() => setWithdrawModalApp(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn--danger-ghost"
                style={{ background: "var(--rose)", color: "#FFFFFF", borderColor: "var(--rose)" }}
                disabled={isWithdrawing}
                onClick={handleWithdrawApplication}
              >
                {isWithdrawing ? "Withdrawing..." : "Confirm Withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === "success" ? (
            <CheckCircle2 size={18} style={{ color: "var(--emerald)" }} />
          ) : (
            <AlertCircle size={18} style={{ color: "var(--rose)" }} />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SINGLE APPLICATION TRACKER CARD
// ============================================================
function ApplicationTrackerCard({
  application,
  isExpanded,
  onToggleExpand,
  onRequestWithdraw,
  onExploreSimilar,
}) {
  const {
    job_title,
    company_name,
    company_logo,
    company_website,
    company_industry,
    job_location,
    job_mode,
    job_type,
    min_salary,
    max_salary,
    status,
    applied_at,
    updated_at,
    resume_url,
    cover_letter,
    job_description,
  } = application;

  const appliedDate = new Date(applied_at);
  const updatedDate = new Date(updated_at || applied_at);
  const daysAgo = Math.max(
    0,
    Math.floor((new Date() - appliedDate) / (1000 * 60 * 60 * 24))
  );

  // Status mapping
  const statusConfig = {
    APPLIED: {
      label: "Application Submitted",
      class: "status-pill-large--applied",
      icon: <Clock size={14} />,
      stage: 1,
      bannerText: "Your application has been received and is queued for recruiter screening.",
    },
    REVIEWING: {
      label: "Under Review",
      class: "status-pill-large--reviewing",
      icon: <Eye size={14} />,
      stage: 2,
      bannerText: "The hiring team is actively reviewing your qualifications and resume.",
    },
    SHORTLISTED: {
      label: "Shortlisted / Interview",
      class: "status-pill-large--shortlisted",
      icon: <Sparkles size={14} />,
      stage: 3,
      bannerText: "Congratulations! You have been shortlisted for an interview round.",
    },
    HIRED: {
      label: "Offer Extended / Hired",
      class: "status-pill-large--hired",
      icon: <Award size={14} />,
      stage: 4,
      bannerText: "🎉 Job offer finalized! Welcome to the team.",
    },
    REJECTED: {
      label: "Not Selected",
      class: "status-pill-large--rejected",
      icon: <X size={14} />,
      stage: -1,
      bannerText: "Thank you for applying. The employer has decided to pursue other candidates for this role.",
    },
  }[status] || {
    label: status,
    class: "status-pill-large--applied",
    icon: <Clock size={14} />,
    stage: 1,
    bannerText: "Application status updated.",
  };

  return (
    <div className="app-card">
      {/* Top Header */}
      <div className="app-card__header">
        <div className="app-card__lead">
          <div className="company-logo">
            {company_logo ? (
              <img src={company_logo} alt={company_name || "Company"} />
            ) : (
              (company_name || "C").charAt(0).toUpperCase()
            )}
          </div>

          <div className="app-card__titles">
            <h3 className="app-card__job-title">{job_title}</h3>
            <div className="app-card__company-line">
              <span>{company_name || "Employer"}</span>
              {company_website && (
                <a
                  href={
                    company_website.startsWith("http")
                      ? company_website
                      : `https://${company_website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-card__company-link"
                >
                  <ExternalLink size={12} /> Website
                </a>
              )}
              {company_industry && <span>• {company_industry}</span>}
            </div>

            <div className="app-card__pills">
              <span className="pill">
                <MapPin size={12} /> {job_location || "Remote"}
              </span>
              {job_mode && (
                <span className="pill">
                  {job_mode.toUpperCase()}
                </span>
              )}
              {job_type && <span className="pill">{job_type}</span>}
              {(min_salary || max_salary) && (
                <span className="pill pill--emerald">
                  <DollarSign size={12} />
                  {min_salary ? `$${Number(min_salary).toLocaleString()}` : ""}
                  {min_salary && max_salary ? " - " : ""}
                  {max_salary ? `$${Number(max_salary).toLocaleString()}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <span className={`status-pill-large ${statusConfig.class}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="stepper-container">
        <div className="stepper-header">
          <div className="stepper-header__title">
            <Layers size={14} /> Full Hiring Pipeline Progress
          </div>
          <div className="stepper-header__time">
            Last update: {updatedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>

        <div className="stepper">
          {/* Step 1: Application Submitted */}
          <div className="step-node">
            <div className="step-node__bar step-node__bar--completed" />
            <div className="step-node__top">
              <div className="step-node__circle step-node__circle--completed">
                <Check size={14} />
              </div>
              <span className="step-node__label">1. Applied</span>
            </div>
            <div className="step-node__desc">
              Submitted on {appliedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>

          {/* Step 2: Screening & Review */}
          <div className="step-node">
            <div
              className={`step-node__bar ${
                status === "REJECTED"
                  ? "step-node__bar--rejected"
                  : statusConfig.stage >= 2
                  ? "step-node__bar--completed"
                  : "step-node__bar--active"
              }`}
            />
            <div className="step-node__top">
              <div
                className={`step-node__circle ${
                  status === "REJECTED"
                    ? "step-node__circle--rejected"
                    : statusConfig.stage > 2
                    ? "step-node__circle--completed"
                    : statusConfig.stage === 2
                    ? "step-node__circle--active"
                    : ""
                }`}
              >
                {status === "REJECTED" ? (
                  <X size={14} />
                ) : statusConfig.stage > 2 ? (
                  <Check size={14} />
                ) : (
                  "2"
                )}
              </div>
              <span className="step-node__label">2. Screening</span>
            </div>
            <div className="step-node__desc">
              {status === "APPLIED"
                ? "Queued for recruiter review"
                : status === "REVIEWING"
                ? "Profile actively under review"
                : status === "REJECTED"
                ? "Screening concluded"
                : "Profile cleared screening"}
            </div>
          </div>

          {/* Step 3: Interview / Shortlist */}
          <div className="step-node">
            <div
              className={`step-node__bar ${
                statusConfig.stage >= 4
                  ? "step-node__bar--completed"
                  : status === "SHORTLISTED"
                  ? "step-node__bar--active"
                  : ""
              }`}
            />
            <div className="step-node__top">
              <div
                className={`step-node__circle ${
                  statusConfig.stage >= 4
                    ? "step-node__circle--completed"
                    : status === "SHORTLISTED"
                    ? "step-node__circle--violet"
                    : ""
                }`}
              >
                {statusConfig.stage >= 4 ? <Check size={14} /> : "3"}
              </div>
              <span className="step-node__label">3. Interview</span>
            </div>
            <div className="step-node__desc">
              {status === "SHORTLISTED"
                ? "Shortlisted for rounds"
                : status === "HIRED"
                ? "Interviews completed"
                : status === "REJECTED"
                ? "Not moved forward"
                : "Pending screening outcome"}
            </div>
          </div>

          {/* Step 4: Decision & Outcome */}
          <div className="step-node">
            <div
              className={`step-node__bar ${
                status === "HIRED"
                  ? "step-node__bar--completed"
                  : status === "REJECTED"
                  ? "step-node__bar--rejected"
                  : ""
              }`}
            />
            <div className="step-node__top">
              <div
                className={`step-node__circle ${
                  status === "HIRED"
                    ? "step-node__circle--completed"
                    : status === "REJECTED"
                    ? "step-node__circle--rejected"
                    : ""
                }`}
              >
                {status === "HIRED" ? (
                  <Award size={14} />
                ) : status === "REJECTED" ? (
                  <X size={14} />
                ) : (
                  "4"
                )}
              </div>
              <span className="step-node__label">4. Outcome</span>
            </div>
            <div className="step-node__desc">
              {status === "HIRED"
                ? "Offer accepted / Hired"
                : status === "REJECTED"
                ? "Application closed"
                : "Final decision pending"}
            </div>
          </div>
        </div>

        {/* Informative stage callout */}
        <div
          style={{
            marginTop: "16px",
            padding: "10px 14px",
            borderRadius: "10px",
            background:
              status === "HIRED"
                ? "var(--emerald-soft)"
                : status === "REJECTED"
                ? "var(--rose-soft)"
                : status === "SHORTLISTED"
                ? "var(--violet-soft)"
                : "#FFFFFF",
            border: "1px solid var(--line)",
            fontSize: "13px",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Info
            size={16}
            style={{
              color:
                status === "HIRED"
                  ? "var(--emerald)"
                  : status === "REJECTED"
                  ? "var(--rose)"
                  : status === "SHORTLISTED"
                  ? "var(--violet)"
                  : "var(--blue)",
              flexShrink: 0,
            }}
          />
          <span>{statusConfig.bannerText}</span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="app-card__footer">
        <div className="app-card__meta-tags">
          <div className="app-card__meta-item">
            <Calendar size={13} />
            <span>
              Applied {daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`}
            </span>
          </div>
          {resume_url && (
            <div className="app-card__meta-item" style={{ color: "var(--blue)" }}>
              <FileText size={13} />
              <a
                href={resume_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                Submitted Resume
              </a>
            </div>
          )}
        </div>

        <div className="app-card__action-btns">
          {status !== "HIRED" && status !== "REJECTED" && (
            <button
              className="btn btn--danger-ghost"
              style={{ fontSize: "12.5px", padding: "6px 12px" }}
              onClick={onRequestWithdraw}
            >
              <Trash2 size={13} /> Withdraw
            </button>
          )}

          <button
            className="btn btn--ghost"
            style={{ fontSize: "12.5px", padding: "6px 14px" }}
            onClick={onToggleExpand}
          >
            {isExpanded ? "Hide Details" : "View Application Details"}
            <ChevronDown
              size={14}
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>
      </div>

      {/* Expanded Details Drawer */}
      {isExpanded && (
        <div className="app-card__expansion">
          <div className="expansion-grid">
            {/* Submitted Cover Letter */}
            <div className="expansion-box">
              <div className="expansion-box__title">
                <FileText size={15} style={{ color: "var(--blue)" }} />
                Submitted Cover Letter
              </div>
              <div className="expansion-box__content">
                {cover_letter ? (
                  cover_letter
                ) : (
                  <span style={{ color: "var(--ink-faint)", fontStyle: "italic" }}>
                    No custom cover letter was attached with this application.
                  </span>
                )}
              </div>
            </div>

            {/* Job Description Snapshot */}
            <div className="expansion-box">
              <div className="expansion-box__title">
                <Briefcase size={15} style={{ color: "var(--violet)" }} />
                Job Description
              </div>
              <div className="expansion-box__content">
                {job_description || (
                  <span style={{ color: "var(--ink-faint)", fontStyle: "italic" }}>
                    Standard full position details. Refer to the job listing for further specifications.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

