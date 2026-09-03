"use client"
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    X,
    SearchX,
    CheckCircle,
    Briefcase,
    Search,
    Sparkles,
    ChevronRight,
    Bookmark,
    ExternalLink,
    Trash2,
    User,
    Settings,
    LogOut,
    ChevronDown,
    MapPin,
    Check,
    Filter,
    RotateCcw,
    DollarSign,
    Building,
    Flag,
    Send,
    CheckCircle2,
    FileText,
    Bell
} from 'lucide-react';

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
    --line: #E4E1EC;
    --line-strong: #D4D0E0;
    --blue-dot: rgba(255, 255, 255, 0.22);
    --on-blue-soft: rgba(255, 255, 255, 0.78);
    --on-blue-faint: rgba(255, 255, 255, 0.6);
    --on-blue-line: rgba(255, 255, 255, 0.28);

    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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

  .nav {
    border-bottom: 1px solid var(--line);
    background: var(--paper);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav__inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 18px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
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
    gap: 32px;
    align-items: center;
    flex-shrink: 0;
  }

  .nav__links a, .nav__link-btn {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    transition: color 0.15s ease;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav__links a:hover,
  .nav__links a:focus-visible,
  .nav__link-btn:hover {
    color: var(--ink);
  }

  .nav__right {
    display: flex;
    align-items: center;
    gap: 16px;
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
    background: var(--paper);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .nav__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--violet-soft);
    color: var(--violet);
    font-weight: 700;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(124, 92, 255, 0.2);
  }

  .nav__profile-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ink);
    white-space: nowrap;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .profile__dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 260px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(20, 18, 28, 0.08);
    overflow: hidden;
    z-index: 200;
    animation: fadeIn 0.15s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .profile__dropdown-header {
    padding: 16px;
    border-bottom: 1px solid var(--line);
    background: var(--paper);
  }

  .profile__dropdown-user {
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 2px;
  }

  .profile__dropdown-email {
    font-size: 12px;
    color: var(--ink-faint);
  }

  .profile__dropdown-body {
    padding: 8px 0;
  }

  .profile__dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ink-soft);
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .profile__dropdown-item:hover {
    background: var(--paper);
    color: var(--ink);
  }

  .profile__dropdown-item--logout {
    color: #E53935;
    border-top: 1px solid var(--line);
    margin-top: 4px;
  }

  .profile__dropdown-item--logout:hover {
    background: #FFEBEE;
    color: #D32F2F;
  }

  .badge {
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    padding: 3px 7px;
    border-radius: 999px;
    background: var(--blue-soft);
    color: var(--blue);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .hero__header {
    background-color: var(--blue);
    background-image: radial-gradient(var(--blue-dot) 1.5px, transparent 1.5px);
    background-size: 22px 22px;
    padding: 56px 32px 64px;
    color: #FFFFFF;
  }

  .hero__header-inner {
    max-width: 1240px;
    margin: 0 auto;
  }

  .hero__eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--violet);
    background: var(--violet-soft);
    padding: 6px 14px;
    border-radius: 999px;
    margin: 0 0 16px;
  }

  .hero__title {
    font-size: 40px;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -0.025em;
    margin: 0 0 12px;
    color: #FFFFFF;
  }

  .hero__subtitle {
    font-size: 16px;
    line-height: 1.5;
    color: var(--on-blue-soft);
    margin: 0 0 28px;
    max-width: 620px;
  }

  .search__box-container {
    position: relative;
    max-width: 780px;
  }

  .search__box {
    display: flex;
    align-items: center;
    background: var(--panel);
    border-radius: 12px;
    padding: 8px 8px 8px 18px;
    box-shadow: 0 12px 32px rgba(20, 18, 28, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.4);
    gap: 12px;
  }

  .search__icon {
    color: var(--ink-faint);
    flex-shrink: 0;
  }

  .search__input-wrapper {
    flex: 1;
    min-width: 0;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .search__label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink-faint);
    margin-bottom: 2px;
  }

  .search__input {
    border: none;
    outline: none;
    font-size: 15px;
    font-weight: 500;
    color: var(--ink);
    width: 100%;
    background: transparent;
  }

  .search__input::placeholder {
    color: var(--ink-faint);
  }

  .search__clear-btn {
    background: transparent;
    border: none;
    color: var(--ink-faint);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .search__clear-btn:hover {
    color: var(--ink);
    background: var(--paper);
  }

  .btn {
    font-size: 14.5px;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    border: none;
    flex-shrink: 0;
    white-space: nowrap;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn--primary {
    background: var(--violet);
    color: #FFFFFF;
  }

  .btn--primary:hover {
    background: #6A48F0;
  }

  .btn--dark {
    background: var(--ink);
    color: #FFFFFF;
  }

  .btn--dark:hover {
    background: var(--blue);
  }

  .btn--ghost {
    background: transparent;
    color: var(--ink-soft);
    border: 1px solid var(--line);
  }

  .btn--ghost:hover {
    border-color: var(--line-strong);
    color: var(--ink);
    background: var(--paper);
  }

  .search__suggestions {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: 0 12px 36px rgba(20, 18, 28, 0.12);
    max-height: 280px;
    overflow-y: auto;
    z-index: 150;
    padding: 6px;
    animation: fadeIn 0.15s ease-out;
  }

  .search__suggestions-header {
    padding: 8px 12px 4px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink-faint);
  }

  .search__suggestion-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.12s ease;
  }

  .search__suggestion-item:hover, .search__suggestion-item--active {
    background: var(--blue-soft);
    color: var(--blue);
  }

  .search__suggestion-tag {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink-soft);
    background: var(--paper);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .search__pills {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .search__pills-label {
    font-size: 12px;
    color: var(--on-blue-faint);
    font-weight: 500;
  }

  .search__pill {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .search__pill:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: #FFFFFF;
  }

  .main__container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 36px 32px 64px;
    width: 100%;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
    align-items: start;
  }

  .sidebar {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: 0 2px 8px rgba(20, 18, 28, 0.02);
    position: sticky;
    top: 88px;
  }

  .sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--line);
  }

  .sidebar__title {
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sidebar__reset-btn {
    font-size: 12px;
    font-weight: 600;
    color: var(--blue);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .sidebar__reset-btn:hover {
    text-decoration: underline;
  }

  .filter__group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .filter__label {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--ink);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .filter__label-sub {
    font-size: 12px;
    color: var(--blue);
    font-weight: 600;
  }

  .select__input {
    width: 100%;
    padding: 10px 12px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 8px;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s ease;
  }

  .select__input:focus, .select__input:hover {
    border-color: var(--line-strong);
  }

  .range__input {
    width: 100%;
    accent-color: var(--blue);
    cursor: pointer;
  }

  .range__labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--ink-faint);
    font-weight: 500;
  }

  .india__section {
    background: var(--violet-soft);
    border: 1px solid rgba(124, 92, 255, 0.25);
    border-radius: 10px;
    padding: 14px;
    margin-top: 4px;
    animation: fadeIn 0.2s ease-out;
  }

  .india__badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    color: var(--violet);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }

  .checkbox__group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .checkbox__label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ink-soft);
    cursor: pointer;
    user-select: none;
    transition: color 0.15s ease;
  }

  .checkbox__label:hover {
    color: var(--ink);
  }

  .checkbox__custom {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid var(--line-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--panel);
    transition: all 0.15s ease;
  }

  .checkbox__input {
    display: none;
  }

  .checkbox__input:checked + .checkbox__custom {
    background: var(--blue);
    border-color: var(--blue);
    color: #FFFFFF;
  }

  .content__area {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .results__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    background: var(--panel);
    padding: 16px 20px;
    border: 1px solid var(--line);
    border-radius: 12px;
  }

  .results__count {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--ink);
    flex-shrink: 0;
  }

  .results__count span {
    color: var(--blue);
  }

  .active__filters {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .active__filter-tag {
    font-size: 12px;
    font-weight: 600;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--line);
    padding: 4px 10px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .active__filter-remove {
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--ink-faint);
    display: flex;
    padding: 0;
  }

  .active__filter-remove:hover {
    color: var(--ink);
  }

  .job__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .job__card {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.2s ease;
    position: relative;
  }

  .job__card:hover {
    border-color: var(--blue);
    box-shadow: 0 8px 24px rgba(59, 111, 224, 0.08);
    transform: translateY(-2px);
  }

  .job__card--featured {
    border-left: 4px solid var(--violet);
  }

  .job__card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .job__card-company-info {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .job__company-logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 18px;
    color: #FFFFFF;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  }

  .job__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .job__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 10px;
  }

  .job__company-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink-soft);
  }

  .job__save-btn {
    background: var(--paper);
    border: 1px solid var(--line);
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--ink-faint);
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .job__save-btn:hover {
    border-color: var(--blue);
    color: var(--blue);
    background: var(--blue-soft);
  }

  .job__save-btn--active {
    background: var(--violet-soft);
    border-color: var(--violet);
    color: var(--violet);
  }

  .job__meta {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    font-size: 13.5px;
    color: var(--ink-soft);
  }

  .job__meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .job__salary-badge {
    font-weight: 700;
    color: #2E7D32;
    background: #E8F5E9;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .job__mode-tag {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 999px;
  }

  .job__mode-tag--OnSite {
    background: var(--paper);
    border: 1px solid var(--line);
    color: var(--ink-soft);
  }

  .job__mode-tag--Remote {
    background: var(--blue-soft);
    color: var(--blue);
  }

  .job__mode-tag--Hybrid {
    background: var(--violet-soft);
    color: var(--violet);
  }

  .job__tags {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .job__tag {
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-soft);
    background: var(--paper);
    padding: 4px 10px;
    border-radius: 6px;
    border: 1px solid var(--line);
  }

  .job__card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--line);
  }

  .job__posted {
    font-size: 12.5px;
    color: var(--ink-faint);
  }

  .job__apply-btn {
    font-size: 14px;
    font-weight: 600;
    padding: 9px 20px;
    border-radius: 8px;
    background: var(--ink);
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .job__apply-btn:hover {
    background: var(--blue);
    box-shadow: 0 4px 12px rgba(59, 111, 224, 0.25);
  }

  .job__apply-btn--applied {
    background: #E8F5E9;
    color: #2E7D32;
    cursor: default;
  }

  .empty__state {
    background: var(--panel);
    border: 1px dashed var(--line-strong);
    border-radius: 14px;
    padding: 56px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .empty__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--blue-soft);
    color: var(--blue);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .empty__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .empty__subtitle {
    font-size: 14px;
    color: var(--ink-soft);
    max-width: 360px;
    margin: 0 0 12px;
  }

  .modal__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(20, 18, 28, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.15s ease-out;
  }

  .modal__content {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 16px;
    width: 100%;
    max-width: 520px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: slideUp 0.2s ease-out;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .modal__header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--line);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    background: var(--paper);
  }

  .modal__header > div:first-child {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .modal__title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .modal__close {
    background: transparent;
    border: none;
    color: var(--ink-faint);
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    flex-shrink: 0;
  }

  .modal__close:hover {
    color: var(--ink);
    background: var(--line);
  }

  .modal__body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form__group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }

  .form__input, .form__textarea {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    border: 1px solid var(--line);
    border-radius: 8px;
    outline: none;
    font-family: inherit;
    color: var(--ink);
    background: var(--panel);
  }

  .form__input:focus, .form__textarea:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px var(--blue-soft);
  }

  .modal__footer {
    padding: 16px 24px;
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: var(--paper);
  }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--ink);
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 500;
    z-index: 2000;
    animation: fadeIn 0.2s ease-out;
  }

  .toast__icon {
    color: #4CAF50;
  }

  @media (max-width: 960px) {
    .main__container {
      grid-template-columns: 1fr;
    }
    .sidebar {
      position: static;
    }
    .nav__links {
      display: none;
    }
    .hero__title {
      font-size: 32px;
    }
  }
`;

const JOB_ROLES = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Engineer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Mobile App Engineer",
    "QA Automation Engineer",
    "Cloud Architect",
    "AI/ML Engineer"
];

const COUNTRIES = [
    "All Countries",
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "Singapore",
    "Australia"
];

const INDIAN_STATES = [
    "All States",
    "Karnataka",
    "Maharashtra",
    "Delhi NCR",
    "Telangana",
    "Tamil Nadu",
    "Haryana",
    "West Bengal",
    "Kerala",
    "Gujarat"
];

const INITIAL_JOBS = [
    {
        id: "job-1",
        title: "Senior Software Engineer - Frontend",
        role: "Software Engineer",
        company: "Google",
        companyLogo: "G",
        companyBg: "#4285F4",
        location: "Bangalore, India",
        country: "India",
        state: "Karnataka",
        salaryRange: "₹28 - ₹42 LPA",
        salaryMin: 28,
        salaryMax: 42,
        jobMode: "Hybrid",
        tags: ["React", "TypeScript", "System Design", "Performance"],
        postedTime: "2 hours ago",
        experience: "4-7 years",
        description: "Looking for an expert Senior Software Engineer to lead frontend architecture for next-gen search & web products.",
        featured: true
    },
    {
        id: "job-2",
        title: "Full Stack Engineer (Node + React)",
        role: "Full Stack Engineer",
        company: "Razorpay",
        companyLogo: "R",
        companyBg: "#0C2340",
        location: "Bangalore, India",
        country: "India",
        state: "Karnataka",
        salaryRange: "₹24 - ₹36 LPA",
        salaryMin: 24,
        salaryMax: 36,
        jobMode: "Remote",
        tags: ["Node.js", "React", "PostgreSQL", "Microservices"],
        postedTime: "5 hours ago",
        experience: "3-5 years",
        description: "Build robust fintech payments infrastructure handling millions of transactions per second across India.",
        featured: true
    },
    {
        id: "job-3",
        title: "Backend Software Engineer - Distributed Systems",
        role: "Backend Developer",
        company: "Microsoft",
        companyLogo: "M",
        companyBg: "#00A4EF",
        location: "Hyderabad, India",
        country: "India",
        state: "Telangana",
        salaryRange: "₹30 - ₹48 LPA",
        salaryMin: 30,
        salaryMax: 48,
        jobMode: "Hybrid",
        tags: ["C#", ".NET Core", "Azure", "Distributed Systems"],
        postedTime: "1 day ago",
        experience: "5+ years",
        description: "Scale cloud backend services on Microsoft Azure with low latency and high availability requirements."
    },
    {
        id: "job-4",
        title: "Staff Software Engineer - Infrastructure",
        role: "Software Engineer",
        company: "Swiggy",
        companyLogo: "S",
        companyBg: "#FC8019",
        location: "Gurugram, India",
        country: "India",
        state: "Haryana",
        salaryRange: "₹38 - ₹55 LPA",
        salaryMin: 38,
        salaryMax: 55,
        jobMode: "OnSite",
        tags: ["Go", "Kubernetes", "Kafka", "AWS"],
        postedTime: "1 day ago",
        experience: "6-10 years",
        description: "Architect high-throughput logistics routing platforms powering hyper-local food delivery."
    },
    {
        id: "job-5",
        title: "Lead Frontend Engineer",
        role: "Frontend Developer",
        company: "Flipkart",
        companyLogo: "F",
        companyBg: "#2874F0",
        location: "Bangalore, India",
        country: "India",
        state: "Karnataka",
        salaryRange: "₹32 - ₹46 LPA",
        salaryMin: 32,
        salaryMax: 46,
        jobMode: "Hybrid",
        tags: ["Next.js", "Redux", "Web Performance", "Accessibility"],
        postedTime: "3 hours ago",
        experience: "5-8 years",
        description: "Drive the core web shopping application for hundreds of millions of monthly active shoppers."
    },
    {
        id: "job-6",
        title: "DevOps & SRE Engineer",
        role: "DevOps Engineer",
        company: "Zomato",
        companyLogo: "Z",
        companyBg: "#CB202D",
        location: "Gurugram, India",
        country: "India",
        state: "Haryana",
        salaryRange: "₹22 - ₹35 LPA",
        salaryMin: 22,
        salaryMax: 35,
        jobMode: "OnSite",
        tags: ["Docker", "Kubernetes", "Terraform", "Prometheus"],
        postedTime: "2 days ago",
        experience: "3-6 years",
        description: "Maintain 99.99% uptime for peak delivery traffic with automated CI/CD and observability."
    },
    {
        id: "job-7",
        title: "AI / ML Engineer - GenAI",
        role: "AI/ML Engineer",
        company: "Atlassian",
        companyLogo: "A",
        companyBg: "#0052CC",
        location: "Bangalore, India",
        country: "India",
        state: "Karnataka",
        salaryRange: "₹35 - ₹50 LPA",
        salaryMin: 35,
        salaryMax: 50,
        jobMode: "Remote",
        tags: ["Python", "PyTorch", "LLMs", "RAG"],
        postedTime: "4 hours ago",
        experience: "3-6 years",
        description: "Build cutting-edge AI features into Jira, Confluence, and developer productivity tools."
    },
    {
        id: "job-8",
        title: "Senior Product Manager",
        role: "Product Manager",
        company: "PhonePe",
        companyLogo: "P",
        companyBg: "#5F259F",
        location: "Mumbai, India",
        country: "India",
        state: "Maharashtra",
        salaryRange: "₹30 - ₹45 LPA",
        salaryMin: 30,
        salaryMax: 45,
        jobMode: "Hybrid",
        tags: ["Product Strategy", "UPI Payments", "Analytics", "Growth"],
        postedTime: "1 day ago",
        experience: "4-8 years",
        description: "Lead consumer payment experiences and merchant growth engines across Tier 1, 2, 3 cities."
    },
    {
        id: "job-9",
        title: "Software Engineer - Core Platform",
        role: "Software Engineer",
        company: "Uber",
        companyLogo: "U",
        companyBg: "#000000",
        location: "San Francisco, USA",
        country: "United States",
        salaryRange: "$140,000 - $190,000 / yr",
        salaryMin: 35,
        salaryMax: 60,
        jobMode: "Hybrid",
        tags: ["Go", "Java", "Distributed Systems", "gRPC"],
        postedTime: "6 hours ago",
        experience: "3-6 years",
        description: "Build global scale trip dispatching systems handling millions of concurrent requests worldwide."
    },
    {
        id: "job-10",
        title: "Data Scientist - Personalization",
        role: "Data Scientist",
        company: "Spotify",
        companyLogo: "S",
        companyBg: "#1DB954",
        location: "London, UK",
        country: "United Kingdom",
        salaryRange: "£75,000 - £110,000 / yr",
        salaryMin: 30,
        salaryMax: 50,
        jobMode: "Remote",
        tags: ["Python", "Spark", "Recommendation Systems", "A/B Testing"],
        postedTime: "1 day ago",
        experience: "4-7 years",
        description: "Optimize music discovery algorithms and personalized daily mix playlists for 500M+ active listeners."
    },
    {
        id: "job-11",
        title: "UI/UX Product Designer",
        role: "UI/UX Designer",
        company: "CRED",
        companyLogo: "C",
        companyBg: "#121212",
        location: "Bangalore, India",
        country: "India",
        state: "Karnataka",
        salaryRange: "₹20 - ₹32 LPA",
        salaryMin: 20,
        salaryMax: 32,
        jobMode: "OnSite",
        tags: ["Figma", "Design Systems", "Prototyping", "Micro-interactions"],
        postedTime: "12 hours ago",
        experience: "2-5 years",
        description: "Craft dark-mode luxury UI experiences and tactile design systems for high-trust fintech."
    },
    {
        id: "job-12",
        title: "iOS Mobile Engineer (Swift)",
        role: "Mobile App Engineer",
        company: "Zomato",
        companyLogo: "Z",
        companyBg: "#E23744",
        location: "Delhi NCR, India",
        country: "India",
        state: "Delhi NCR",
        salaryRange: "₹22 - ₹34 LPA",
        salaryMin: 22,
        salaryMax: 34,
        jobMode: "Hybrid",
        tags: ["Swift", "SwiftUI", "iOS", "Mobile Security"],
        postedTime: "3 days ago",
        experience: "3-5 years",
        description: "Architect fluid mobile order flows, live GPS maps tracking, and high-FPS UI animations."
    }
];

function Navbar({ user, savedJobsCount, onOpenSavedJobs, onOpenSettings, onOpenProfile, onLogout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="nav" id="top-navbar">
            <div className="nav__inner">
                <div className="nav__brand">
                    <div className="nav__logo-icon">
                        <Briefcase size={20} />
                    </div>
                    <div className="nav__mark">
                        JobPortal<span className="nav__mark-dot">.</span>
                    </div>
                </div>

                <div className="nav__links">
                    <a href="#explore">Explore Jobs</a>
                    <a href="#companies">Companies</a>
                    <button className="nav__link-btn" onClick={onOpenSavedJobs}>
                        Saved Jobs
                        {savedJobsCount > 0 && <span className="badge">{savedJobsCount}</span>}
                    </button>
                    <button className="nav__link-btn" onClick={onOpenProfile}>
                        My Profile
                    </button>
                </div>

                <div className="nav__right" ref={dropdownRef}>
                    <button
                        id="user-profile-btn"
                        className="nav__profile-btn"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-expanded={dropdownOpen}
                        aria-haspopup="true"
                    >
                        <div className="nav__avatar">
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="nav__profile-name">{user?.name || 'User'}</span>
                        <ChevronDown size={15} style={{ color: 'var(--ink-faint)' }} />
                    </button>

                    {dropdownOpen && (
                        <div className="profile__dropdown" id="user-profile-menu">
                            <div className="profile__dropdown-header">
                                <div className="profile__dropdown-user">{user?.name || 'User'}</div>
                                <div className="profile__dropdown-email">{user?.email || ''}</div>
                            </div>

                            <div className="profile__dropdown-body">
                                <button
                                    className="profile__dropdown-item"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onOpenProfile();
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={16} /> View Profile
                                    </span>
                                </button>

                                <button
                                    className="profile__dropdown-item"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onOpenSavedJobs();
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Bookmark size={16} /> Saved Jobs
                                    </span>
                                    <span className="badge">{savedJobsCount}</span>
                                </button>

                                <button
                                    className="profile__dropdown-item"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onOpenSettings();
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Settings size={16} /> Settings
                                    </span>
                                </button>

                                <button
                                    className="profile__dropdown-item profile__dropdown-item--logout"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onLogout();
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LogOut size={16} /> Log Out
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function SearchBar({ searchQuery, onSearchChange, onSelectRole }) {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef(null);

    const suggestions = JOB_ROLES.filter((role) =>
        role.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (roleName) => {
        onSelectRole(roleName);
        setIsFocused(false);
    };

    const popularPills = ["Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "Data Scientist"];

    return (
        <div className="hero__header">
            <div className="hero__header-inner">
                <div className="hero__eyebrow">
                    <Sparkles size={14} /> Over 10,000+ Verified Tech Jobs
                </div>
                <h1 className="hero__title">
                    Discover Your Next High-Impact Role
                </h1>
                <p className="hero__subtitle">
                    Search software engineering, cloud architecture, and product positions from top tech leaders and fast-growing startups.
                </p>

                <div className="search__box-container" ref={containerRef}>
                    <div className="search__box">
                        <Search className="search__icon" size={20} style={{ flexShrink: 0 }} />
                        <div className="search__input-wrapper">
                            <span className="search__label">Job Role or Keyword</span>
                            <input
                                id="job-search-input"
                                type="text"
                                className="search__input"
                                placeholder="e.g. Software Engineer, Frontend, DevOps..."
                                value={searchQuery}
                                onChange={(e) => {
                                    onSearchChange(e.target.value);
                                    setIsFocused(true);
                                }}
                                onFocus={() => setIsFocused(true)}
                                autoComplete="off"
                            />
                        </div>

                        {searchQuery && (
                            <button
                                className="search__clear-btn"
                                title="Clear Search"
                                onClick={() => {
                                    onSearchChange('');
                                    setIsFocused(true);
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}

                        <button
                            id="search-submit-btn"
                            className="btn btn--primary"
                            onClick={() => setIsFocused(false)}
                        >
                            Search Jobs
                        </button>
                    </div>

                    {isFocused && (
                        <div className="search__suggestions" id="job-role-suggestions">
                            <div className="search__suggestions-header">
                                {searchQuery ? 'Matching Job Roles' : 'Suggested Roles'}
                            </div>
                            {suggestions.length > 0 ? (
                                suggestions.map((role) => (
                                    <div
                                        key={role}
                                        className="search__suggestion-item"
                                        onClick={() => handleSelect(role)}
                                    >
                                        <span>{role}</span>
                                        <span className="search__suggestion-tag">
                                            Role <ChevronRight size={12} style={{ display: 'inline', marginLeft: '2px' }} />
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '12px', fontSize: '13px', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                                    No predefined role matched "{searchQuery}". Select or search any custom term!
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="search__pills">
                    <span className="search__pills-label">Popular Searches:</span>
                    {popularPills.map((pill) => (
                        <button
                            key={pill}
                            className="search__pill"
                            onClick={() => handleSelect(pill)}
                        >
                            {pill}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function FilterSidebar({ filters, onFilterChange, onResetFilters }) {
    const handleModeToggle = (mode) => {
        const currentModes = filters.jobModes;
        if (currentModes.includes(mode)) {
            onFilterChange({ jobModes: currentModes.filter((m) => m !== mode) });
        } else {
            onFilterChange({ jobModes: [...currentModes, mode] });
        }
    };

    const isIndiaSelected = filters.country === 'India';

    return (
        <aside className="sidebar" id="filter-sidebar">
            <div className="sidebar__header">
                <div className="sidebar__title">
                    <Filter size={18} /> Filter Jobs
                </div>
                <button
                    className="sidebar__reset-btn"
                    onClick={onResetFilters}
                    title="Reset all filters"
                >
                    <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Reset
                </button>
            </div>

            <div className="filter__group">
                <label className="filter__label" htmlFor="country-select">
                    <span><MapPin size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--blue)' }} /> Location</span>
                </label>
                <select
                    id="country-select"
                    className="select__input"
                    value={filters.country}
                    onChange={(e) => {
                        const country = e.target.value;
                        onFilterChange({
                            country,
                            indianState: country === 'India' ? filters.indianState : 'All States',
                        });
                    }}
                >
                    {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            {isIndiaSelected && (
                <div className="india__section" id="india-states-filter">
                    <div className="india__badge">
                        <Flag size={12} /> Indian State Filter
                    </div>
                    <label className="filter__label" htmlFor="state-select" style={{ fontSize: '12.5px', marginBottom: '6px' }}>
                        Select Indian State:
                    </label>
                    <select
                        id="state-select"
                        className="select__input"
                        value={filters.indianState}
                        onChange={(e) => onFilterChange({ indianState: e.target.value })}
                        style={{ background: '#FFFFFF', borderColor: 'rgba(124, 92, 255, 0.3)' }}
                    >
                        {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="filter__group">
                <div className="filter__label">
                    <span><DollarSign size={15} style={{ display: 'inline', marginRight: '4px', color: 'var(--blue)' }} /> Min Salary Threshold</span>
                    <span className="filter__label-sub">
                        {filters.salaryRange === 0 ? 'Any Salary' : `₹${filters.salaryRange}+ LPA`}
                    </span>
                </div>
                <input
                    id="salary-range-slider"
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    className="range__input"
                    value={filters.salaryRange}
                    onChange={(e) => onFilterChange({ salaryRange: Number(e.target.value) })}
                />
                <div className="range__labels">
                    <span>₹0 LPA</span>
                    <span>₹25 LPA</span>
                    <span>₹50+ LPA</span>
                </div>
            </div>

            <div className="filter__group">
                <label className="filter__label">
                    <span><Building size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--blue)' }} /> Job Mode</span>
                </label>
                <div className="checkbox__group">
                    {(['OnSite', 'Remote', 'Hybrid']).map((mode) => {
                        const checked = filters.jobModes.includes(mode);
                        return (
                            <label key={mode} className="checkbox__label">
                                <input
                                    type="checkbox"
                                    className="checkbox__input"
                                    checked={checked}
                                    onChange={() => handleModeToggle(mode)}
                                />
                                <div className="checkbox__custom">
                                    {checked && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                </div>
                                <span>{mode}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}

function JobCard({ job, isSaved, isApplied, onSaveToggle, onApplyClick }) {
    return (
        <div
            className={`job__card ${job.featured ? 'job__card--featured' : ''}`}
            id={`job-card-${job.id}`}
        >
            <div className="job__card-top">
                <div className="job__card-company-info">
                    <div
                        className="job__company-logo"
                        style={{ backgroundColor: job.companyBg || 'var(--blue)' }}
                    >
                        {job.companyLogo}
                    </div>

                    <div className="job__details">
                        <h3 className="job__title">
                            {job.title}
                            {job.featured && (
                                <span className="badge" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }}>
                                    Featured
                                </span>
                            )}
                        </h3>
                        <span className="job__company-name">{job.company}</span>
                    </div>
                </div>

                <button
                    className={`job__save-btn ${isSaved ? 'job__save-btn--active' : ''}`}
                    onClick={() => onSaveToggle(job.id)}
                    title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
                >
                    <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
            </div>

            <div className="job__meta">
                <div className="job__salary-badge">
                    {job.salaryRange}
                </div>

                <div className="job__meta-item">
                    <MapPin size={15} style={{ color: 'var(--ink-faint)' }} />
                    <span>{job.location}</span>
                </div>

                <div className={`job__mode-tag job__mode-tag--${job.jobMode}`}>
                    {job.jobMode}
                </div>

                <div className="job__meta-item">
                    <Briefcase size={15} style={{ color: 'var(--ink-faint)' }} />
                    <span>{job.experience}</span>
                </div>
            </div>

            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: '1.5' }}>
                {job.description}
            </p>

            <div className="job__tags">
                {job.tags.map((tag) => (
                    <span key={tag} className="job__tag">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="job__card-bottom">
                <span className="job__posted">Posted {job.postedTime}</span>

                {isApplied ? (
                    <button className="job__apply-btn job__apply-btn--applied" disabled>
                        <Check size={16} /> Applied
                    </button>
                ) : (
                    <button
                        className="job__apply-btn"
                        onClick={() => onApplyClick(job)}
                    >
                        Apply Now <ExternalLink size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

function ApplyModal({ job, user, onClose, onSubmitApplication }) {
    const [fullName, setFullName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [coverNote, setCoverNote] = useState('');
    const [resumeName, setResumeName] = useState('Alex_Morgan_Resume_2026.pdf');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            onSubmitApplication(job.id);
            onClose();
        }, 1200);
    };

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div>
                        <h3 className="modal__title">Apply to {job.company}</h3>
                        <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                            {job.title} ({job.location})
                        </span>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {submitted ? (
                    <div className="modal__body" style={{ textAlign: 'center', padding: '40px 24px' }}>
                        <CheckCircle2 size={48} style={{ color: '#2E7D32', margin: '0 auto 12px' }} />
                        <h3 style={{ margin: '0 0 6px', fontSize: '20px', color: 'var(--ink)' }}>
                            Application Submitted!
                        </h3>
                        <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '14px' }}>
                            Your profile and resume have been forwarded directly to {job.company}'s recruitment team.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="modal__body">
                            <div className="form__group">
                                <label className="form__label">Full Name</label>
                                <input
                                    type="text"
                                    className="form__input"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label className="form__label">Email Address</label>
                                <input
                                    type="email"
                                    className="form__input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form__group">
                                <label className="form__label">Attached Resume</label>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 14px',
                                        background: 'var(--paper)',
                                        border: '1px solid var(--line)',
                                        borderRadius: '8px',
                                        fontSize: '13.5px',
                                        color: 'var(--ink)',
                                    }}
                                >
                                    <FileText size={18} style={{ color: 'var(--blue)' }} />
                                    <span style={{ flex: 1, fontWeight: 500 }}>{resumeName}</span>
                                    <label
                                        style={{
                                            fontSize: '12px',
                                            color: 'var(--blue)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Change
                                        <input
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setResumeName(e.target.files[0].name);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="form__group">
                                <label className="form__label">Quick Cover Note (Optional)</label>
                                <textarea
                                    className="form__textarea"
                                    rows={3}
                                    placeholder="Highlight why you are a great fit for this software engineering role..."
                                    value={coverNote}
                                    onChange={(e) => setCoverNote(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="modal__footer">
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn--primary"
                            >
                                <Send size={15} /> Submit Application
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

function SavedJobsModal({ savedJobs, appliedJobIds, onClose, onRemoveSaved, onApplyClick }) {
    return (
        <div className="modal__overlay" onClick={onClose}>
            <div
                className="modal__content"
                style={{ maxWidth: '640px' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bookmark size={20} style={{ color: 'var(--violet)' }} />
                        <h3 className="modal__title">Saved Jobs ({savedJobs.length})</h3>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="modal__body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                    {savedJobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--ink-soft)' }}>
                            <Bookmark size={36} style={{ color: 'var(--ink-faint)', margin: '0 auto 12px' }} />
                            <p style={{ margin: 0, fontWeight: 600 }}>No saved jobs yet</p>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink-faint)' }}>
                                Click the bookmark icon on any job card to save it for later review!
                            </p>
                        </div>
                    ) : (
                        savedJobs.map((job) => {
                            const isApplied = appliedJobIds.includes(job.id);
                            return (
                                <div
                                    key={job.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px',
                                        border: '1px solid var(--line)',
                                        borderRadius: '10px',
                                        background: 'var(--panel)',
                                        gap: '12px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                        <div
                                            className="job__company-logo"
                                            style={{
                                                backgroundColor: job.companyBg || 'var(--blue)',
                                                width: '38px',
                                                height: '38px',
                                                fontSize: '14px',
                                            }}
                                        >
                                            {job.companyLogo}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink)' }}>
                                                {job.title}
                                            </h4>
                                            <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                                                {job.company} • {job.location} • <strong style={{ color: '#2E7D32' }}>{job.salaryRange}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isApplied ? (
                                            <span className="badge" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                                                Applied
                                            </span>
                                        ) : (
                                            <button
                                                className="job__apply-btn"
                                                style={{ padding: '6px 12px', fontSize: '12.5px' }}
                                                onClick={() => {
                                                    onClose();
                                                    onApplyClick(job);
                                                }}
                                            >
                                                Apply <ExternalLink size={12} />
                                            </button>
                                        )}

                                        <button
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--ink-faint)',
                                                cursor: 'pointer',
                                                padding: '6px',
                                            }}
                                            title="Remove from saved"
                                            onClick={() => onRemoveSaved(job.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="modal__footer">
                    <button className="btn btn--ghost" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function SettingsModal({ user, onClose, onSaveUser }) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [title, setTitle] = useState(user.title);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSaveUser({
            ...user,
            name,
            email,
            title,
        });
        setSavedSuccess(true);
        setTimeout(() => {
            setSavedSuccess(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={20} style={{ color: 'var(--blue)' }} />
                        <h3 className="modal__title">Account Settings</h3>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal__body">
                        {savedSuccess && (
                            <div
                                style={{
                                    padding: '10px 14px',
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <Check size={16} /> Settings saved successfully!
                            </div>
                        )}

                        <div className="form__group">
                            <label className="form__label">
                                <User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name
                            </label>
                            <input
                                type="text"
                                className="form__input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label">Email Address</label>
                            <input
                                type="email"
                                className="form__input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label">Professional Headline / Job Role</label>
                            <input
                                type="text"
                                className="form__input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>

                        <div className="form__group" style={{ marginTop: '8px' }}>
                            <label className="checkbox__label">
                                <input
                                    type="checkbox"
                                    className="checkbox__input"
                                    checked={emailAlerts}
                                    onChange={(e) => setEmailAlerts(e.target.checked)}
                                />
                                <div className="checkbox__custom">
                                    {emailAlerts && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                </div>
                                <span>
                                    <Bell size={14} style={{ display: 'inline', marginRight: '4px' }} /> Receive daily job recommendations for {title || 'Software Engineering'}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="modal__footer">
                        <button type="button" className="btn btn--ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary">
                            Save Preferences
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function HomePage() {
    const router = useRouter();
    const [authChecking, setAuthChecking] = useState(true);
    const [user, setUser] = useState({
        name: 'User',
        email: '',
        title: 'Software Professional',
        avatar: 'U',
    });

    const [jobs] = useState(INITIAL_JOBS);
    const [savedJobIds, setSavedJobIds] = useState(['job-1', 'job-2']);
    const [appliedJobIds, setAppliedJobIds] = useState(['job-3']);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        searchQuery: '',
        salaryRange: 0,
        country: 'All Countries',
        indianState: 'All States',
        jobModes: [],
    });

    const [activeModal, setActiveModal] = useState(null);
    const [selectedJobForApply, setSelectedJobForApply] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    // Verify session on page load
    useEffect(() => {
        let isMounted = true;
        async function verifyUser() {
            try {
                const localToken = typeof window !== 'undefined' ? localStorage.getItem('job_portal_token') : null;
                const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('job_portal_user') : null;

                if (cachedUser) {
                    try {
                        setUser(JSON.parse(cachedUser));
                    } catch {}
                }

                const res = await fetch('/api/auth', {
                    headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
                });
                const data = await res.json();

                if (isMounted) {
                    if (!data.authenticated || !data.user) {
                        // User not logged in, redirect to auth page
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('job_portal_token');
                            localStorage.removeItem('job_portal_user');
                        }
                        router.replace('/auth');
                        return;
                    }

                    setUser(data.user);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('job_portal_user', JSON.stringify(data.user));
                    }
                    setAuthChecking(false);
                }
            } catch (err) {
                console.error('Home auth check error:', err);
                if (isMounted) {
                    router.replace('/auth');
                }
            }
        }

        verifyUser();
        return () => {
            isMounted = false;
        };
    }, [router]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout' }),
            });
        } catch {}

        if (typeof window !== 'undefined') {
            localStorage.removeItem('job_portal_token');
            localStorage.removeItem('job_portal_user');
        }

        showToast('Logged out successfully');
        setTimeout(() => {
            router.replace('/auth');
        }, 400);
    };

    const handleSaveSettings = async (updated) => {
        try {
            const localToken = typeof window !== 'undefined' ? localStorage.getItem('job_portal_token') : null;
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(localToken ? { Authorization: `Bearer ${localToken}` } : {}),
                },
                body: JSON.stringify({
                    action: 'update_profile',
                    updates: updated,
                }),
            });
            const data = await res.json();
            if (data.success && data.user) {
                setUser(data.user);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('job_portal_user', JSON.stringify(data.user));
                }
                showToast('Account preferences saved');
            } else {
                setUser(updated);
                showToast('Account preferences saved locally');
            }
        } catch {
            setUser(updated);
            showToast('Account preferences saved');
        }
    };

    const handleFilterChange = (updated) => {
        setFilters((prev) => ({ ...prev, ...updated }));
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setFilters({
            searchQuery: '',
            salaryRange: 0,
            country: 'All Countries',
            indianState: 'All States',
            jobModes: [],
        });
        showToast('Filters reset to default');
    };

    const handleSaveToggle = (jobId) => {
        if (savedJobIds.includes(jobId)) {
            setSavedJobIds(savedJobIds.filter((id) => id !== jobId));
            showToast('Removed job from Saved Jobs');
        } else {
            setSavedJobIds([...savedJobIds, jobId]);
            showToast('Job saved successfully!');
        }
    };

    const handleApplyClick = (job) => {
        setSelectedJobForApply(job);
        setActiveModal('apply');
    };

    const handleSubmitApplication = (jobId) => {
        if (!appliedJobIds.includes(jobId)) {
            setAppliedJobIds([...appliedJobIds, jobId]);
            showToast('Application submitted successfully!');
        }
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchesQuery =
                    job.title.toLowerCase().includes(q) ||
                    job.role.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q) ||
                    job.tags.some((tag) => tag.toLowerCase().includes(q)) ||
                    job.description.toLowerCase().includes(q);
                if (!matchesQuery) return false;
            }

            if (filters.country !== 'All Countries') {
                if (job.country !== filters.country) return false;
            }

            if (filters.country === 'India' && filters.indianState !== 'All States') {
                if (job.state !== filters.indianState) return false;
            }

            if (filters.salaryRange > 0) {
                if (job.salaryMin < filters.salaryRange) return false;
            }

            if (filters.jobModes.length > 0) {
                if (!filters.jobModes.includes(job.jobMode)) return false;
            }

            return true;
        });
    }, [jobs, searchQuery, filters]);

    const savedJobsList = useMemo(() => {
        return jobs.filter((job) => savedJobIds.includes(job.id));
    }, [jobs, savedJobIds]);

    if (authChecking) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBFBFD', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', color: '#5B5867' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #E4E1EC', borderTopColor: '#3B6FE0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Loading JobPortal...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page" id="job-portal-app">
            <style>{styles}</style>

            <Navbar
                user={user}
                savedJobsCount={savedJobIds.length}
                onOpenSavedJobs={() => setActiveModal('saved')}
                onOpenSettings={() => setActiveModal('settings')}
                onOpenProfile={() => router.push('/profile')}
                onLogout={handleLogout}
            />

            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={(q) => setSearchQuery(q)}
                onSelectRole={(role) => {
                    setSearchQuery(role);
                    showToast(`Filtered by role: ${role}`);
                }}
            />

            <main className="main__container">
                <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                />

                <section className="content__area">
                    <div className="results__bar">
                        <div className="results__count">
                            Showing <span>{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Available
                        </div>

                        <div className="active__filters">
                            {searchQuery && (
                                <span className="active__filter-tag">
                                    Role: "{searchQuery}"
                                    <button
                                        className="active__filter-remove"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.country !== 'All Countries' && (
                                <span className="active__filter-tag">
                                    Country: {filters.country}
                                    <button
                                        className="active__filter-remove"
                                        onClick={() => handleFilterChange({ country: 'All Countries', indianState: 'All States' })}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.country === 'India' && filters.indianState !== 'All States' && (
                                <span className="active__filter-tag" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }}>
                                    State: {filters.indianState}
                                    <button
                                        className="active__filter-remove"
                                        onClick={() => handleFilterChange({ indianState: 'All States' })}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.salaryRange > 0 && (
                                <span className="active__filter-tag">
                                    Min ₹{filters.salaryRange} LPA
                                    <button
                                        className="active__filter-remove"
                                        onClick={() => handleFilterChange({ salaryRange: 0 })}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.jobModes.map((mode) => (
                                <span key={mode} className="active__filter-tag">
                                    {mode}
                                    <button
                                        className="active__filter-remove"
                                        onClick={() =>
                                            handleFilterChange({
                                                jobModes: filters.jobModes.filter((m) => m !== mode),
                                            })
                                        }
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {filteredJobs.length > 0 ? (
                        <div className="job__list" id="job-cards-list">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    isSaved={savedJobIds.includes(job.id)}
                                    isApplied={appliedJobIds.includes(job.id)}
                                    onSaveToggle={handleSaveToggle}
                                    onApplyClick={handleApplyClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty__state">
                            <div className="empty__icon">
                                <SearchX size={28} />
                            </div>
                            <h3 className="empty__title">No jobs match your search</h3>
                            <p className="empty__subtitle">
                                Try clearing your filters or searching for another job role like "Software Engineer" or "Frontend Developer".
                            </p>
                            <button className="btn btn--primary" onClick={handleResetFilters}>
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </section>
            </main>

            {activeModal === 'apply' && selectedJobForApply && (
                <ApplyModal
                    job={selectedJobForApply}
                    user={user}
                    onClose={() => {
                        setActiveModal(null);
                        setSelectedJobForApply(null);
                    }}
                    onSubmitApplication={handleSubmitApplication}
                />
            )}

            {activeModal === 'saved' && (
                <SavedJobsModal
                    savedJobs={savedJobsList}
                    appliedJobIds={appliedJobIds}
                    onClose={() => setActiveModal(null)}
                    onRemoveSaved={handleSaveToggle}
                    onApplyClick={handleApplyClick}
                />
            )}

            {activeModal === 'settings' && (
                <SettingsModal
                    user={user}
                    onClose={() => setActiveModal(null)}
                    onSaveUser={handleSaveSettings}
                />
            )}

            {toastMessage && (
                <div className="toast" id="app-toast">
                    <CheckCircle size={18} className="toast__icon" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    );
}