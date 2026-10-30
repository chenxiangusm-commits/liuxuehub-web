"use client";
import type {School} from "@/types";
import ProgramExplorer from "@/components/ProgramExplorer";
export default function SchoolMatchClient({schools:_schools}:{schools:School[]}) {return <ProgramExplorer matching/>;}
