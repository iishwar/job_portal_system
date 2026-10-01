"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
    Send,
    CheckCircle2,
    FileText,
    Bell,
    PlusCircle,
    Layers,
    Users,
    Clock,
    Globe,
    Link as LinkIcon,
    AlertCircle
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
    --emerald: #10B981;
    --emerald-soft: #ECFDF5;
    --amber: #F59E0B;
    --amber-soft: #FFFBEB;
    --rose: #EF4444;
    --rose-soft: #FEF2F2;
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
  .nav__link-btn:hover {
    color: var(--ink);
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
    box-shadow: 0 10px 30px rgba(20, 18, 28, 0.12);
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

  .profile__dropdown-role {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--blue-soft);
    color: var(--blue);
    margin-top: 4px;
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
    font-size: 38px;
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
    font-size: 14px;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    border: none;
    flex-shrink: 0;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn--primary {
    background: var(--blue);
    color: #FFFFFF;
  }

  .btn--primary:hover {
    background: #2D5EC9;
  }

  .btn--violet {
    background: var(--violet);
    color: #FFFFFF;
  }

  .btn--violet:hover {
    background: #6A48F0;
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
    gap: 10px;
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

  .select__input, .text__input {
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

  .select__input:focus, .text__input:focus {
    border-color: var(--blue);
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

  .job__card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .job__card-company-info {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .job__company-logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--blue);
    color: #FFFFFF;
    font-weight: 700;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .job__details {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .job__title {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .job__company-name {
    font-size: 13.5px;
    font-weight: 500;
    color: var(--ink-soft);
  }

  .job__save-btn {
    background: transparent;
    border: none;
    color: var(--ink-faint);
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .job__save-btn:hover {
    background: var(--paper);
    color: var(--violet);
  }

  .job__save-btn--active {
    color: var(--violet);
  }

  .job__meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 13px;
    font-weight: 500;
    color: var(--ink-soft);
  }

  .job__salary-badge {
    background: var(--emerald-soft);
    color: var(--emerald);
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 13px;
  }

  .job__mode-tag {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .job__mode-tag--REMOTE {
    background: #E8F5E9;
    color: #2E7D32;
  }

  .job__mode-tag--HYBRID {
    background: var(--violet-soft);
    color: var(--violet);
  }

  .job__mode-tag--ONSITE {
    background: var(--blue-soft);
    color: var(--blue);
  }

  .job__meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .job__card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    margin-top: 2px;
  }

  .job__posted {
    font-size: 12px;
    color: var(--ink-faint);
    font-weight: 500;
  }

  .job__apply-btn {
    background: var(--blue);
    color: #FFFFFF;
    font-size: 13.5px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.15s ease;
  }

  .job__apply-btn:hover {
    background: #2D5EC9;
  }

  .job__apply-btn--applied {
    background: var(--emerald-soft);
    color: var(--emerald);
    cursor: default;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .empty__state {
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 48px 24px;
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
    background: var(--paper);
    color: var(--ink-faint);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
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
    margin: 0 0 12px;
    max-width: 440px;
    line-height: 1.5;
  }

  .modal__overlay {
    position: fixed;
    inset: 0;
    background: rgba(20, 18, 28, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 500;
    padding: 20px;
    animation: fadeIn 0.15s ease-out;
  }

  .modal__content {
    background: var(--panel);
    border-radius: 14px;
    border: 1px solid var(--line);
    width: 100%;
    max-width: 540px;
    box-shadow: 0 20px 40px rgba(20, 18, 28, 0.2);
    overflow: hidden;
    animation: scaleUp 0.15s ease-out;
  }

  @keyframes scaleUp {
    from { transform: scale(0.96); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
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

  .modal__close {
    background: transparent;
    border: none;
    color: var(--ink-faint);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
  }

  .modal__close:hover {
    color: var(--ink);
    background: var(--paper);
  }

  .modal__body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 75vh;
    overflow-y: auto;
  }

  .modal__footer {
    padding: 16px 24px;
    border-top: 1px solid var(--line);
    background: var(--paper);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
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

  .form__input, .form__textarea, .form__select {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    color: var(--ink);
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 8px;
    outline: none;
    font-family: inherit;
    transition: border-color 0.15s ease;
  }

  .form__input:focus, .form__textarea:focus, .form__select:focus {
    border-color: var(--blue);
  }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--ink);
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideUp 0.2s ease-out;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .toast__icon {
    color: var(--emerald);
  }

  @media (max-width: 900px) {
    .main__container {
      grid-template-columns: 1fr;
    }
    .sidebar {
      position: static;
    }
  }
`;

function Navbar({ user, savedJobsCount, applicationsCount, onOpenSavedJobs, onOpenApplications, onOpenSettings, onOpenPostJob, onOpenEmployerJobs, onLogout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isEmployer = user?.role === 'EMPLOYER' || user?.role === 'ADMIN';

    return (
        <nav className="nav" id="top-navbar">
            <div className="nav__inner">
                <div className="nav__brand" onClick={() => router.push('/home')}>
                    <div className="nav__logo-icon">
                        <Briefcase size={20} />
                    </div>
                    <div className="nav__mark">
                        JobPortal<span className="nav__mark-dot">.</span>
                    </div>
                </div>

                <div className="nav__links">
                    <button className="nav__link-btn" onClick={() => router.push('/home')}>
                        Explore Jobs
                    </button>

                    {isEmployer ? (
                        <>
                            <button className="nav__link-btn" onClick={onOpenEmployerJobs}>
                                <Layers size={15} /> My Posted Jobs
                            </button>
                            <button className="btn btn--violet" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={onOpenPostJob}>
                                <PlusCircle size={15} /> Post a Job
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="nav__link-btn" onClick={onOpenSavedJobs}>
                                <Bookmark size={15} /> Saved Jobs
                                {savedJobsCount > 0 && <span className="badge">{savedJobsCount}</span>}
                            </button>
                            <button className="nav__link-btn" onClick={onOpenApplications}>
                                <FileText size={15} /> My Applications
                                {applicationsCount > 0 && <span className="badge" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>{applicationsCount}</span>}
                            </button>
                        </>
                    )}
                </div>

                <div className="nav__right" ref={dropdownRef}>
                    <button
                        id="user-profile-btn"
                        className="nav__profile-btn"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-expanded={dropdownOpen}
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
                                <span className="profile__dropdown-role">{user?.role || 'JOB_SEEKER'}</span>
                            </div>

                            <div className="profile__dropdown-body">
                                <button
                                    className="profile__dropdown-item"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        router.push('/profile');
                                    }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={16} /> View Profile
                                    </span>
                                </button>

                                {isEmployer ? (
                                    <button
                                        className="profile__dropdown-item"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            onOpenEmployerJobs();
                                        }}
                                    >
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Layers size={16} /> Manage Posted Jobs
                                        </span>
                                    </button>
                                ) : (
                                    <>
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
                                                onOpenApplications();
                                            }}
                                        >
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FileText size={16} /> My Applications
                                            </span>
                                            <span className="badge">{applicationsCount}</span>
                                        </button>
                                    </>
                                )}

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

function SearchBar({ searchQuery, onSearchChange, onSearchSubmit }) {
    return (
        <div className="hero__header">
            <div className="hero__header-inner">
                <div className="hero__eyebrow">
                    <Sparkles size={14} /> Direct Employer Postings & Verified Roles
                </div>
                <h1 className="hero__title">
                    Discover Your Next High-Impact Role
                </h1>
                <p className="hero__subtitle">
                    Search and apply directly to published tech jobs, distributed roles, and top engineering teams.
                </p>

                <form className="search__box-container" onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}>
                    <div className="search__box">
                        <Search className="search__icon" size={20} />
                        <div className="search__input-wrapper">
                            <span className="search__label">Search by Title, Company, or Skill</span>
                            <input
                                id="job-search-input"
                                type="text"
                                className="search__input"
                                placeholder="e.g. Frontend Engineer, Full Stack, PostgreSQL, Swiggy..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>

                        {searchQuery && (
                            <button
                                type="button"
                                className="search__clear-btn"
                                title="Clear Search"
                                onClick={() => {
                                    onSearchChange('');
                                    onSearchSubmit('');
                                }}
                            >
                                <X size={16} />
                            </button>
                        )}

                        <button
                            id="search-submit-btn"
                            type="submit"
                            className="btn btn--primary"
                        >
                            Search Jobs
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FilterSidebar({ filters, onFilterChange, onResetFilters }) {
    const handleModeToggle = (modeVal) => {
        const currentModes = filters.jobModes || [];
        if (currentModes.includes(modeVal)) {
            onFilterChange({ jobModes: currentModes.filter((m) => m !== modeVal) });
        } else {
            onFilterChange({ jobModes: [...currentModes, modeVal] });
        }
    };

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
                <label className="filter__label" htmlFor="location-filter">
                    <span><MapPin size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--blue)' }} /> Location</span>
                </label>
                <input
                    id="location-filter"
                    type="text"
                    className="text__input"
                    placeholder="e.g. Bangalore, Remote, Pune..."
                    value={filters.location || ''}
                    onChange={(e) => onFilterChange({ location: e.target.value })}
                />
            </div>

            <div className="filter__group">
                <div className="filter__label">
                    <span><DollarSign size={15} style={{ display: 'inline', marginRight: '4px', color: 'var(--blue)' }} /> Min Salary LPA</span>
                    <span className="filter__label-sub">
                        {filters.minSalary === 0 || !filters.minSalary ? 'Any Salary' : `₹${filters.minSalary}+ LPA`}
                    </span>
                </div>
                <input
                    id="salary-range-slider"
                    type="range"
                    min="0"
                    max="60"
                    step="5"
                    className="range__input"
                    value={filters.minSalary || 0}
                    onChange={(e) => onFilterChange({ minSalary: Number(e.target.value) })}
                />
                <div className="range__labels">
                    <span>₹0 LPA</span>
                    <span>₹30 LPA</span>
                    <span>₹60+ LPA</span>
                </div>
            </div>

            <div className="filter__group">
                <label className="filter__label">
                    <span><Building size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--blue)' }} /> Work Mode</span>
                </label>
                <div className="checkbox__group">
                    {['REMOTE', 'HYBRID', 'ONSITE'].map((modeVal) => {
                        const checked = (filters.jobModes || []).includes(modeVal);
                        return (
                            <label key={modeVal} className="checkbox__label">
                                <input
                                    type="checkbox"
                                    className="checkbox__input"
                                    checked={checked}
                                    onChange={() => handleModeToggle(modeVal)}
                                />
                                <div className="checkbox__custom">
                                    {checked && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                </div>
                                <span>{modeVal.charAt(0) + modeVal.slice(1).toLowerCase()}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="filter__group">
                <label className="filter__label">
                    <span><Briefcase size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--blue)' }} /> Experience Level</span>
                </label>
                <select
                    className="select__input"
                    value={filters.experienceLevel || ''}
                    onChange={(e) => onFilterChange({ experienceLevel: e.target.value })}
                >
                    <option value="">All Experience Levels</option>
                    <option value="Entry">Entry Level (0-2 yrs)</option>
                    <option value="Mid">Mid Level (2-5 yrs)</option>
                    <option value="Senior">Senior Level (5+ yrs)</option>
                    <option value="Lead">Lead / Architect</option>
                </select>
            </div>
        </aside>
    );
}

function JobCard({ job, isSaved, isApplied, isEmployer, onSaveToggle, onApplyClick }) {
    const formattedSalary = useMemo(() => {
        if (job.min_salary && job.max_salary) {
            return `₹${job.min_salary} - ₹${job.max_salary} LPA`;
        } else if (job.min_salary) {
            return `₹${job.min_salary}+ LPA`;
        } else if (job.max_salary) {
            return `Up to ₹${job.max_salary} LPA`;
        }
        return 'Competitive Pay';
    }, [job.min_salary, job.max_salary]);

    const formattedDate = useMemo(() => {
        if (!job.created_at) return 'Recently';
        const d = new Date(job.created_at);
        const diffHours = Math.floor((new Date() - d) / (1000 * 60 * 60));
        if (diffHours < 24) return `${Math.max(1, diffHours)}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }, [job.created_at]);

    const companyInitial = (job.company_name || job.employer_name || 'C').charAt(0).toUpperCase();

    return (
        <div className="job__card" id={`job-card-${job.job_id}`}>
            <div className="job__card-top">
                <div className="job__card-company-info">
                    <div className="job__company-logo">
                        {companyInitial}
                    </div>

                    <div className="job__details">
                        <h3 className="job__title">
                            {job.title}
                            {job.job_type && (
                                <span className="badge">
                                    {job.job_type}
                                </span>
                            )}
                        </h3>
                        <span className="job__company-name">
                            {job.company_name || job.employer_name || 'Hiring Company'}
                        </span>
                    </div>
                </div>

                {!isEmployer && (
                    <button
                        className={`job__save-btn ${isSaved ? 'job__save-btn--active' : ''}`}
                        onClick={() => onSaveToggle(job.job_id)}
                        title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
                    >
                        <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                )}
            </div>

            <div className="job__meta">
                <div className="job__salary-badge">
                    {formattedSalary}
                </div>

                {job.location && (
                    <div className="job__meta-item">
                        <MapPin size={15} style={{ color: 'var(--ink-faint)' }} />
                        <span>{job.location}</span>
                    </div>
                )}

                <div className={`job__mode-tag job__mode-tag--${job.mode || 'REMOTE'}`}>
                    {job.mode || 'REMOTE'}
                </div>

                {job.experience_level && (
                    <div className="job__meta-item">
                        <Briefcase size={15} style={{ color: 'var(--ink-faint)' }} />
                        <span>{job.experience_level}</span>
                    </div>
                )}

                {job.application_count > 0 && (
                    <div className="job__meta-item" style={{ color: 'var(--ink-faint)' }}>
                        <Users size={14} />
                        <span>{job.application_count} {job.application_count === 1 ? 'applicant' : 'applicants'}</span>
                    </div>
                )}
            </div>

            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: '1.5' }}>
                {job.description}
            </p>

            <div className="job__card-bottom">
                <span className="job__posted">
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Posted {formattedDate}
                </span>

                {isEmployer ? (
                    <span className="badge" style={{ background: 'var(--violet-soft)', color: 'var(--violet)' }}>
                        Employer View
                    </span>
                ) : isApplied ? (
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
    const [resumeUrl, setResumeUrl] = useState(user?.profile?.resume_url || '');
    const [coverLetter, setCoverLetter] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: job.job_id,
                    resumeUrl: resumeUrl.trim() || null,
                    coverLetter: coverLetter.trim() || null,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                setErrorMsg(data.error || 'Failed to submit application');
                setIsSubmitting(false);
                return;
            }

            onSubmitApplication(job.job_id);
            onClose();
        } catch (err) {
            console.error('Apply error:', err);
            setErrorMsg('Network error. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div>
                        <h3 className="modal__title">Apply to {job.company_name || job.employer_name || 'Role'}</h3>
                        <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                            {job.title} • {job.location || 'Remote'}
                        </span>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal__body">
                        {errorMsg && (
                            <div style={{ padding: '10px 14px', background: 'var(--rose-soft)', color: 'var(--rose)', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} /> {errorMsg}
                            </div>
                        )}

                        <div className="form__group">
                            <label className="form__label">Applicant Name</label>
                            <input
                                type="text"
                                className="form__input"
                                value={user?.name || ''}
                                disabled
                                style={{ background: 'var(--paper)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label">Applicant Email</label>
                            <input
                                type="email"
                                className="form__input"
                                value={user?.email || ''}
                                disabled
                                style={{ background: 'var(--paper)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label">Resume Link or Portfolio URL</label>
                            <input
                                type="url"
                                className="form__input"
                                placeholder="https://drive.google.com/... or https://myportfolio.com"
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label">Cover Letter / Note (Optional)</label>
                            <textarea
                                className="form__textarea"
                                rows={4}
                                placeholder="Share why you're a great fit for this position..."
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal__footer">
                        <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={isSubmitting}
                        >
                            <Send size={15} /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function PostJobModal({ user, onClose, onJobCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [mode, setMode] = useState('REMOTE');
    const [jobType, setJobType] = useState('Full-time');
    const [experienceLevel, setExperienceLevel] = useState('Mid');
    const [isPosting, setIsPosting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!title.trim() || !description.trim()) {
            setErrorMsg('Title and description are required.');
            return;
        }

        setIsPosting(true);
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    location: location.trim() || null,
                    min_salary: minSalary ? Number(minSalary) : null,
                    max_salary: maxSalary ? Number(maxSalary) : null,
                    mode,
                    job_type: jobType,
                    experience_level: experienceLevel,
                    status: 'PUBLISHED',
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                setErrorMsg(data.error || 'Failed to post job');
                setIsPosting(false);
                return;
            }

            onJobCreated(data.job);
            onClose();
        } catch (err) {
            console.error('Job post error:', err);
            setErrorMsg('Network error. Failed to post job.');
            setIsPosting(false);
        }
    };

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlusCircle size={20} style={{ color: 'var(--violet)' }} />
                        <h3 className="modal__title">Post a New Job Opening</h3>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal__body">
                        {errorMsg && (
                            <div style={{ padding: '10px 14px', background: 'var(--rose-soft)', color: 'var(--rose)', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} /> {errorMsg}
                            </div>
                        )}

                        <div className="form__group">
                            <label className="form__label">Job Title *</label>
                            <input
                                type="text"
                                className="form__input"
                                placeholder="e.g. Senior Backend Engineer"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form__group">
                                <label className="form__label">Work Mode *</label>
                                <select
                                    className="form__select"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                >
                                    <option value="REMOTE">Remote</option>
                                    <option value="HYBRID">Hybrid</option>
                                    <option value="ONSITE">Onsite</option>
                                </select>
                            </div>

                            <div className="form__group">
                                <label className="form__label">Job Type</label>
                                <select
                                    className="form__select"
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form__group">
                                <label className="form__label">Location</label>
                                <input
                                    type="text"
                                    className="form__input"
                                    placeholder="e.g. Bangalore, India"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <div className="form__group">
                                <label className="form__label">Experience Level</label>
                                <select
                                    className="form__select"
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                >
                                    <option value="Entry">Entry Level</option>
                                    <option value="Mid">Mid Level</option>
                                    <option value="Senior">Senior Level</option>
                                    <option value="Lead">Lead / Staff</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="form__group">
                                <label className="form__label">Min Salary (LPA)</label>
                                <input
                                    type="number"
                                    className="form__input"
                                    placeholder="e.g. 18"
                                    value={minSalary}
                                    onChange={(e) => setMinSalary(e.target.value)}
                                />
                            </div>

                            <div className="form__group">
                                <label className="form__label">Max Salary (LPA)</label>
                                <input
                                    type="number"
                                    className="form__input"
                                    placeholder="e.g. 35"
                                    value={maxSalary}
                                    onChange={(e) => setMaxSalary(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form__group">
                            <label className="form__label">Job Description *</label>
                            <textarea
                                className="form__textarea"
                                rows={5}
                                placeholder="Describe the role responsibilities, requirements, and tech stack..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal__footer">
                        <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={onClose}
                            disabled={isPosting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--violet"
                            disabled={isPosting}
                        >
                            <PlusCircle size={15} /> {isPosting ? 'Publishing...' : 'Publish Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function SavedJobsModal({ savedJobs, appliedJobIds, onClose, onRemoveSaved, onApplyClick }) {
    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bookmark size={20} style={{ color: 'var(--violet)' }} />
                        <h3 className="modal__title">Saved Jobs ({savedJobs.length})</h3>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="modal__body" style={{ maxHeight: '440px', overflowY: 'auto' }}>
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
                            const isApplied = appliedJobIds.includes(job.job_id);
                            return (
                                <div
                                    key={job.job_id}
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
                                        <div className="job__company-logo" style={{ width: '38px', height: '38px', fontSize: '14px' }}>
                                            {(job.company_name || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink)' }}>
                                                {job.title}
                                            </h4>
                                            <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                                                {job.company_name || 'Hiring Co'} • {job.location || 'Remote'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isApplied ? (
                                            <span className="badge" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
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
                                            onClick={() => onRemoveSaved(job.job_id)}
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

function ApplicationsModal({ applications, onClose }) {
    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} style={{ color: 'var(--emerald)' }} />
                        <h3 className="modal__title">My Applications ({applications.length})</h3>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="modal__body" style={{ maxHeight: '440px', overflowY: 'auto' }}>
                    {applications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--ink-soft)' }}>
                            <FileText size={36} style={{ color: 'var(--ink-faint)', margin: '0 auto 12px' }} />
                            <p style={{ margin: 0, fontWeight: 600 }}>No applications submitted yet</p>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink-faint)' }}>
                                When you apply to jobs, your application statuses will appear here in real time.
                            </p>
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div
                                key={app.application_id}
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
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink)' }}>
                                        {app.job_title}
                                    </h4>
                                    <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                                        {app.company_name || 'Employer'} • {app.job_location || 'Remote'}
                                    </span>
                                    <div style={{ fontSize: '11px', color: 'var(--ink-faint)', marginTop: '4px' }}>
                                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div>
                                    <span
                                        className="badge"
                                        style={{
                                            padding: '5px 10px',
                                            background:
                                                app.status === 'HIRED'
                                                    ? '#ECFDF5'
                                                    : app.status === 'SHORTLISTED'
                                                    ? '#F1EDFF'
                                                    : app.status === 'REJECTED'
                                                    ? '#FEF2F2'
                                                    : '#EAF0FE',
                                            color:
                                                app.status === 'HIRED'
                                                    ? '#10B981'
                                                    : app.status === 'SHORTLISTED'
                                                    ? '#7C5CFF'
                                                    : app.status === 'REJECTED'
                                                    ? '#EF4444'
                                                    : '#3B6FE0',
                                        }}
                                    >
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))
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

function EmployerDashboardModal({ user, onClose, onRefreshJobs }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEmployerApps() {
            try {
                const res = await fetch('/api/applications');
                const data = await res.json();
                if (data.success) {
                    setApplications(data.applications || []);
                }
            } catch (err) {
                console.error('Fetch employer applications error:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployerApps();
    }, []);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            const res = await fetch('/api/applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ applicationId, status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setApplications((prev) =>
                    prev.map((a) => (a.application_id === applicationId ? { ...a, status: newStatus } : a))
                );
            }
        } catch (err) {
            console.error('Status change error:', err);
        }
    };

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} style={{ color: 'var(--blue)' }} />
                        <h3 className="modal__title">Received Job Applications ({applications.length})</h3>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className="modal__body" style={{ maxHeight: '460px', overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '30px' }}>Loading applicant data...</div>
                    ) : applications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--ink-soft)' }}>
                            <Users size={36} style={{ color: 'var(--ink-faint)', margin: '0 auto 12px' }} />
                            <p style={{ margin: 0, fontWeight: 600 }}>No applicants received yet</p>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink-faint)' }}>
                                Candidates who apply to your posted jobs will appear here for review.
                            </p>
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div
                                key={app.application_id}
                                style={{
                                    padding: '16px',
                                    border: '1px solid var(--line)',
                                    borderRadius: '10px',
                                    background: 'var(--panel)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--ink)' }}>
                                            {app.applicant_name} <span style={{ fontSize: '13px', color: 'var(--ink-faint)', fontWeight: 400 }}>({app.applicant_email})</span>
                                        </h4>
                                        <span style={{ fontSize: '13px', color: 'var(--blue)', fontWeight: 600 }}>
                                            Applied for: {app.job_title}
                                        </span>
                                    </div>

                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.application_id, e.target.value)}
                                        className="select__input"
                                        style={{ width: 'auto', padding: '4px 8px', fontSize: '12px' }}
                                    >
                                        <option value="APPLIED">Applied</option>
                                        <option value="REVIEWING">Reviewing</option>
                                        <option value="SHORTLISTED">Shortlisted</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="HIRED">Hired</option>
                                    </select>
                                </div>

                                {app.cover_letter && (
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', background: 'var(--paper)', padding: '8px 12px', borderRadius: '6px' }}>
                                        "{app.cover_letter}"
                                    </p>
                                )}

                                <div style={{ display: 'flex', gap: '12px', fontSize: '12.5px', color: 'var(--ink-faint)', alignItems: 'center' }}>
                                    {app.resume_url && (
                                        <a href={app.resume_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <LinkIcon size={13} /> View Resume
                                        </a>
                                    )}
                                    {app.applicant_phone && <span>Phone: {app.applicant_phone}</span>}
                                    {app.applicant_location && <span>Location: {app.applicant_location}</span>}
                                </div>
                            </div>
                        ))
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
    const [name, setName] = useState(user?.name || '');
    const [emailNotifications, setEmailNotifications] = useState(user?.settings?.email_notifications !== false);
    const [jobAlerts, setJobAlerts] = useState(user?.settings?.job_alerts !== false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_settings',
                    email_notifications: emailNotifications,
                    job_alerts: jobAlerts,
                }),
            });

            if (name !== user?.name) {
                await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_profile',
                        updates: { name },
                    }),
                });
            }

            onSaveUser({
                ...user,
                name,
                settings: { email_notifications: emailNotifications, job_alerts: jobAlerts },
            });
            onClose();
        } catch (err) {
            console.error('Settings save error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={20} style={{ color: 'var(--blue)' }} />
                        <h3 className="modal__title">Account & Notification Settings</h3>
                    </div>
                    <button className="modal__close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal__body">
                        <div className="form__group">
                            <label className="form__label">Full Name</label>
                            <input
                                type="text"
                                className="form__input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form__group">
                            <label className="form__label">Registered Email</label>
                            <input
                                type="email"
                                className="form__input"
                                value={user?.email || ''}
                                disabled
                                style={{ background: 'var(--paper)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form__group" style={{ marginTop: '8px' }}>
                            <label className="checkbox__label">
                                <input
                                    type="checkbox"
                                    className="checkbox__input"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                />
                                <div className="checkbox__custom">
                                    {emailNotifications && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                </div>
                                <span>Receive Email Notifications for Application Updates</span>
                            </label>
                        </div>

                        <div className="form__group">
                            <label className="checkbox__label">
                                <input
                                    type="checkbox"
                                    className="checkbox__input"
                                    checked={jobAlerts}
                                    onChange={(e) => setJobAlerts(e.target.checked)}
                                />
                                <div className="checkbox__custom">
                                    {jobAlerts && <span style={{ fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                                </div>
                                <span>Receive Daily Job Alerts & Recommendations</span>
                            </label>
                        </div>
                    </div>

                    <div className="modal__footer">
                        <button type="button" className="btn btn--ghost" onClick={onClose} disabled={isSaving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Settings'}
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
    const [user, setUser] = useState(null);

    // Live Database State
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [savedJobsList, setSavedJobsList] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [applicationsList, setApplicationsList] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        minSalary: 0,
        jobModes: [],
        experienceLevel: '',
    });

    const [activeModal, setActiveModal] = useState(null);
    const [selectedJobForApply, setSelectedJobForApply] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // 1. Check user auth
    useEffect(() => {
        let isMounted = true;
        async function verifyUser() {
            try {
                const res = await fetch('/api/auth');
                const data = await res.json();

                if (isMounted) {
                    if (!data.authenticated || !data.user) {
                        router.replace('/auth');
                        return;
                    }
                    setUser(data.user);
                    setAuthChecking(false);
                }
            } catch (err) {
                console.error('Home auth check error:', err);
                if (isMounted) router.replace('/auth');
            }
        }
        verifyUser();
        return () => { isMounted = false; };
    }, [router]);

    // 2. Fetch live jobs
    const fetchJobs = useCallback(async () => {
        setLoadingJobs(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery.trim()) params.append('search', searchQuery.trim());
            if (filters.location.trim()) params.append('location', filters.location.trim());
            if (filters.minSalary > 0) params.append('minSalary', String(filters.minSalary));
            if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
            if (filters.jobModes.length === 1) params.append('mode', filters.jobModes[0]);

            const res = await fetch(`/api/jobs?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                let fetched = data.jobs || [];
                if (filters.jobModes.length > 1) {
                    fetched = fetched.filter((j) => filters.jobModes.includes(j.mode));
                }
                setJobs(fetched);
            }
        } catch (err) {
            console.error('Error loading jobs:', err);
        } finally {
            setLoadingJobs(false);
        }
    }, [searchQuery, filters]);

    useEffect(() => {
        if (!authChecking) {
            fetchJobs();
        }
    }, [authChecking, fetchJobs]);

    // 3. Fetch user's saved jobs and applications
    useEffect(() => {
        if (!user || user.role === 'EMPLOYER') return;

        async function fetchUserData() {
            try {
                const [savedRes, appsRes] = await Promise.all([
                    fetch('/api/saved-jobs'),
                    fetch('/api/applications')
                ]);

                const savedData = await savedRes.json();
                if (savedData.success) {
                    setSavedJobsList(savedData.savedJobs || []);
                    setSavedJobIds((savedData.savedJobs || []).map((j) => j.job_id));
                }

                const appsData = await appsRes.json();
                if (appsData.success) {
                    setApplicationsList(appsData.applications || []);
                    setAppliedJobIds((appsData.applications || []).map((a) => a.job_id));
                }
            } catch (err) {
                console.error('Error loading user applications/saved:', err);
            }
        }

        fetchUserData();
    }, [user]);

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
        setTimeout(() => router.replace('/auth'), 400);
    };

    const handleSaveToggle = async (jobId) => {
        try {
            const res = await fetch('/api/saved-jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, action: 'toggle' }),
            });
            const data = await res.json();
            if (data.success) {
                setSavedJobIds(data.savedJobIds || []);
                showToast(data.message || (data.isSaved ? 'Job saved!' : 'Job removed'));

                const refreshed = await fetch('/api/saved-jobs');
                const refreshedData = await refreshed.json();
                if (refreshedData.success) {
                    setSavedJobsList(refreshedData.savedJobs || []);
                }
            }
        } catch (err) {
            console.error('Save toggle error:', err);
        }
    };

    const handleApplyClick = (job) => {
        setSelectedJobForApply(job);
        setActiveModal('apply');
    };

    const handleApplicationSubmitted = async (jobId) => {
        setAppliedJobIds((prev) => [...prev, jobId]);
        showToast('Application submitted successfully!');

        try {
            const appsRes = await fetch('/api/applications');
            const appsData = await appsRes.json();
            if (appsData.success) {
                setApplicationsList(appsData.applications || []);
            }
        } catch {}
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setFilters({
            location: '',
            minSalary: 0,
            jobModes: [],
            experienceLevel: '',
        });
        showToast('Filters reset');
    };

    if (authChecking) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBFBFD', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', color: '#5B5867' }}>
                    <div style={{ width: '32px', height: '32px', border: '3px solid #E4E1EC', borderTopColor: '#3B6FE0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Connecting to JobPortal...</span>
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
                applicationsCount={applicationsList.length}
                onOpenSavedJobs={() => setActiveModal('saved')}
                onOpenApplications={() => setActiveModal('applications')}
                onOpenSettings={() => setActiveModal('settings')}
                onOpenPostJob={() => setActiveModal('post_job')}
                onOpenEmployerJobs={() => setActiveModal('employer_dashboard')}
                onLogout={handleLogout}
            />

            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={fetchJobs}
            />

            <main className="main__container">
                <FilterSidebar
                    filters={filters}
                    onFilterChange={(up) => setFilters((p) => ({ ...p, ...up }))}
                    onResetFilters={handleResetFilters}
                />

                <section className="content__area">
                    <div className="results__bar">
                        <div className="results__count">
                            Showing <span>{jobs.length}</span> {jobs.length === 1 ? 'Job' : 'Jobs'} Available
                        </div>

                        <div className="active__filters">
                            {searchQuery && (
                                <span className="active__filter-tag">
                                    Keyword: "{searchQuery}"
                                    <button className="active__filter-remove" onClick={() => setSearchQuery('')}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.location && (
                                <span className="active__filter-tag">
                                    Location: {filters.location}
                                    <button className="active__filter-remove" onClick={() => setFilters((p) => ({ ...p, location: '' }))}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {filters.minSalary > 0 && (
                                <span className="active__filter-tag">
                                    Min ₹{filters.minSalary} LPA
                                    <button className="active__filter-remove" onClick={() => setFilters((p) => ({ ...p, minSalary: 0 }))}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            {(filters.jobModes || []).map((modeVal) => (
                                <span key={modeVal} className="active__filter-tag">
                                    {modeVal}
                                    <button
                                        className="active__filter-remove"
                                        onClick={() => setFilters((p) => ({ ...p, jobModes: p.jobModes.filter((m) => m !== modeVal) }))}
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}

                            {filters.experienceLevel && (
                                <span className="active__filter-tag">
                                    Level: {filters.experienceLevel}
                                    <button className="active__filter-remove" onClick={() => setFilters((p) => ({ ...p, experienceLevel: '' }))}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>

                    {loadingJobs ? (
                        <div className="empty__state">
                            <div style={{ width: '28px', height: '28px', border: '3px solid #E4E1EC', borderTopColor: '#3B6FE0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)' }}>Loading real jobs from database...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="job__list" id="job-cards-list">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job.job_id}
                                    job={job}
                                    isSaved={savedJobIds.includes(job.job_id)}
                                    isApplied={appliedJobIds.includes(job.job_id)}
                                    isEmployer={user?.role === 'EMPLOYER'}
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
                            <h3 className="empty__title">No Jobs Found in Database</h3>
                            <p className="empty__subtitle">
                                {user?.role === 'EMPLOYER'
                                    ? "You haven't posted any jobs yet, or no jobs match the current filters. Click 'Post a Job' above to publish the first role!"
                                    : "No active jobs match your search filters. Try clearing your filters or check back shortly."}
                            </p>
                            {user?.role === 'EMPLOYER' ? (
                                <button className="btn btn--violet" onClick={() => setActiveModal('post_job')}>
                                    <PlusCircle size={15} /> Post a Job
                                </button>
                            ) : (
                                <button className="btn btn--primary" onClick={handleResetFilters}>
                                    Reset All Filters
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Modals */}
            {activeModal === 'apply' && selectedJobForApply && (
                <ApplyModal
                    job={selectedJobForApply}
                    user={user}
                    onClose={() => {
                        setActiveModal(null);
                        setSelectedJobForApply(null);
                    }}
                    onSubmitApplication={handleApplicationSubmitted}
                />
            )}

            {activeModal === 'post_job' && (
                <PostJobModal
                    user={user}
                    onClose={() => setActiveModal(null)}
                    onJobCreated={(newJob) => {
                        showToast('Job opening published to database!');
                        fetchJobs();
                    }}
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

            {activeModal === 'applications' && (
                <ApplicationsModal
                    applications={applicationsList}
                    onClose={() => setActiveModal(null)}
                />
            )}

            {activeModal === 'employer_dashboard' && (
                <EmployerDashboardModal
                    user={user}
                    onClose={() => setActiveModal(null)}
                    onRefreshJobs={fetchJobs}
                />
            )}

            {activeModal === 'settings' && (
                <SettingsModal
                    user={user}
                    onClose={() => setActiveModal(null)}
                    onSaveUser={(updatedUser) => {
                        setUser(updatedUser);
                        showToast('Settings saved successfully');
                    }}
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