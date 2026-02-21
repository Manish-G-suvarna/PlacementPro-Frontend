"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Activity, Briefcase, MapPin, Calendar, Search } from "lucide-react";
import styles from "./RadialNavigation.module.css";

const OPTIONS = [
    { id: "status", icon: Activity, label: "Status" },
    { id: "companies", icon: Briefcase, label: "Companies" },
    { id: "map", icon: MapPin, label: "Map" },
    { id: "events", icon: Calendar, label: "Events" },
    { id: "search", icon: Search, label: "Search" },
];

export default function RadialNavigation() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef(null);
    const lastScrollY = useRef(0);
    const shouldReduceMotion = useReducedMotion();

    // Scroll effect for hide/show navigation
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Scrolling down (hide)
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setIsVisible(false);
                if (isOpen) setIsOpen(false); // Close menu if open
            }
            // Scrolling up (show)
            else if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isOpen]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

    // Handle keyboard escape exactly
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    // Position surrounding buttons in a semi-circle from left to right (0 to 180 degrees)
    const RADIUS = 110; // pixels
    const angles = [0, 45, 90, 135, 180];

    const getPosition = (index) => {
        const angle = angles[index];
        const radians = (angle * Math.PI) / 180;
        return {
            x: RADIUS * Math.cos(radians),
            y: RADIUS * Math.sin(radians),
        };
    };

    return (
        <motion.div
            className={styles.navContainer}
            ref={containerRef}
            initial={{ opacity: 1 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.blurOverlay}
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsOpen(false)} // clicking overlay closes menu
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen &&
                    OPTIONS.map((option, index) => {
                        const pos = getPosition(index);

                        return (
                            <motion.button
                                key={option.id}
                                className={styles.optionButton}
                                aria-label={option.label}
                                // Animation states
                                initial={{
                                    opacity: 0,
                                    x: 0,
                                    y: 0,
                                    scale: shouldReduceMotion ? 1 : 0.5,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: pos.x,
                                    y: pos.y,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: shouldReduceMotion ? 0 : index * 0.05,
                                    },
                                }}
                                exit={{
                                    opacity: 0,
                                    x: 0,
                                    y: 0,
                                    scale: shouldReduceMotion ? 1 : 0.5,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25,
                                        delay: shouldReduceMotion
                                            ? 0
                                            : (OPTIONS.length - 1 - index) * 0.05,
                                    },
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (option.id === "map") {
                                        router.push("/map");
                                        setIsOpen(false);
                                    } else if (option.id === "status") {
                                        router.push("/status");
                                        setIsOpen(false);
                                    } else {
                                        console.log(`Clicked ${option.id}`);
                                    }
                                }}
                            >
                                <div className={styles.tooltipContainer}>
                                    <option.icon size={20} />
                                    <span className={styles.tooltip}>{option.label}</span>
                                </div>
                            </motion.button>
                        );
                    })}
            </AnimatePresence>

            <motion.button
                className={styles.centerButton}
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Replace /logo.png with the actual image name once you place it in the public folder */}
                <img
                    src="https://res.cloudinary.com/dljlwfn2x/image/upload/v1771645859/placementpro_assets/febxwymrnzkvmkuelew5.png"
                    alt="Menu Hub"
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
            </motion.button>
        </motion.div>
    );
}
