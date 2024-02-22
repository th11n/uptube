"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
} from "@/components/ui/select"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type MovieInfo = {
    title: string;
    description: string;
}

type PrivacyOption = "public" | "private" | "unlisted";

const Dropzone = () => {
    const { data: session }: any = useSession();
    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            signIn();
        }
    }, [session]);
    const [convertedFileUrl, setConvertedFileUrl] = useState<string | undefined>(undefined);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [movieInfo, setMovieInfo] = useState<MovieInfo>({
        title: '',
        description: '',
    });
    const [category, setCategory] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [privacyStatus, setPrivacyStatus] = useState<PrivacyOption>("public");

    const handleChangePrivacy = (newPrivacy: PrivacyOption) => {
        setPrivacyStatus(newPrivacy);
      };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAudioFile(e.target.files?.[0] || null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageFile(e.target.files?.[0] || null);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMovieInfo((prevMovieInfo) => ({
            ...prevMovieInfo,
            title: e.target.value,
        }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMovieInfo((prevMovieInfo) => ({
            ...prevMovieInfo,
            description: e.target.value,
        }));
    };

    const handleCategoryChange = (e: string) => {
        setCategory(e);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("test")
        event.preventDefault();
        console.log("test1")

        const formData = new FormData();
        if (audioFile) {
            formData.append("audioFile", audioFile);
        }

        if (imageFile) {
            formData.append("imageFile", imageFile);
        }


        try {
            const endpoint = "http://127.0.0.1:8000/merge";
            const response = await fetch(endpoint, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();

                const formData = new FormData();
                formData.append("video", blob, `${movieInfo.title}.mp4`)
                formData.append("accessToken", session.accessToken)
                formData.append("title", movieInfo.title)
                formData.append("description", movieInfo.description)
                if (category)
                    formData.append("category", category)
                console.log(category)
                formData.append("privacyStatus", privacyStatus)

                const uploadResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: formData
                })

                setConvertedFileUrl(URL.createObjectURL(blob));
            } else {
                console.error("Error:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <label className="flex justify-center w-full h-32 px-4 transition bg-[#252529] border-2 border-dashed rounded-md appearance-none cursor-pointer border-[#44b78b] hover:border-solid hover:bg-transparent focus:outline-none">
                <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#949c9c]" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-[#949c9c]">
                        {audioFile ? `${audioFile.name}` : 'Drop audio file to Attach, or browse'}
                    </span>
                </span>
                <input type="file" name="file_upload" className="hidden" accept="audio/*" onChange={(e) => { handleFileChange(e); setOpen(true); }} />
            </label>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex justify-center bg-[#1e1e20] border-[#44b78b] h-11/12 w-80 !max-w-full text-white">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogDescription className="flex flex-col h-5/6 text-[#fffff5db] gap-8 pt-8">
                                <div className="grid w-64 max-w-sm items-center gap-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input required id="title" onChange={(e) => handleTitleChange(e)} type="text" placeholder="Your title here..." className="border-x-0 p-0 bg-transparent border-t-0 rounded-none w-64 focus:border-[#44b78b] !ring-offset-0 !ring-transparent focus:rounded-sm transition duration-700 ease-in-out" />
                                </div>
                                <div className="grid w-64 max-w-sm items-center gap-1.5">
                                    <Label htmlFor="desc">Description</Label>
                                    <Textarea required id="desc" onChange={(e) => handleDescriptionChange(e)} placeholder="Your description here..." className="border-x-0 p-0 bg-transparent border-t-0 rounded-none w-64 focus:border-[#44b78b] !ring-offset-0 !ring-transparent focus:rounded-sm transition duration-700 ease-in-out" />
                                </div>
                                <div className="grid w-64 max-w-sm items-center gap-1.5">
                                    <Label htmlFor="picture">Background image</Label>
                                    <Input required id="picture" type="file" onChange={(e) => { handleImageChange(e) }} accept="image/*" className="file:text-white file:p-0 file:mr-4 text-white border-x-0 bg-transparent border-t-0 rounded-none hover:file:text-[#44b78b] hover:file:transition hover:file:duration-700 hover:file:ease-in-out hover:" />
                                </div>
                                <div className="grid w-64 max-w-sm items-center gap-1.5">
                                    <Label>Category</Label>
                                    <Select onValueChange={(e) => { handleCategoryChange(e); console.log(category) }} required>
                                        <SelectTrigger className="w-full bg-transparent border-x-0 border-t-0 rounded-none focus:border-[#44b78b] !ring-offset-0 !ring-transparent transition duration-700 ease-in-out">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent className="overflow-y-auto max-h-[350px] bg-transparent text-white backdrop-blur-xl border-[#44b78b] shadow-lg">
                                            <SelectGroup>
                                                <SelectItem value="1">Film & Animation</SelectItem>
                                                <SelectItem value="2">Autos & Vehicles</SelectItem>
                                                <SelectItem value="10">Music</SelectItem>
                                                <SelectItem value="15">Pets & Animals</SelectItem>
                                                <SelectItem value="17">Sports</SelectItem>
                                                <SelectItem value="18">Short Movies</SelectItem>
                                                <SelectItem value="19">Travel & Events</SelectItem>
                                                <SelectItem value="20">Gaming</SelectItem>
                                                <SelectItem value="22">People & Blogs</SelectItem>
                                                <SelectItem value="23">Comedy</SelectItem>
                                                <SelectItem value="24">Entertainment</SelectItem>
                                                <SelectItem value="25">News & Politics</SelectItem>
                                                <SelectItem value="26">Howto & Style</SelectItem>
                                                <SelectItem value="27">Education</SelectItem>
                                                <SelectItem value="28">Science & Technology</SelectItem>
                                                <SelectItem value="29">Nonprofits & Activism</SelectItem>
                                                <SelectItem value="30">Movies</SelectItem>
                                                <SelectItem value="31">Anime/Animation</SelectItem>
                                                <SelectItem value="32">Action/Adventure</SelectItem>
                                                <SelectItem value="33">Classics</SelectItem>
                                                <SelectItem value="34">Comedy</SelectItem>
                                                <SelectItem value="35">Documentary</SelectItem>
                                                <SelectItem value="36">Drama</SelectItem>
                                                <SelectItem value="37">Family</SelectItem>
                                                <SelectItem value="38">Foreign</SelectItem>
                                                <SelectItem value="39">Horror</SelectItem>
                                                <SelectItem value="40">Sci-Fi/Fantasy</SelectItem>
                                                <SelectItem value="41">Thriller</SelectItem>
                                                <SelectItem value="42">Shorts</SelectItem>
                                                <SelectItem value="43">Shows</SelectItem>
                                                <SelectItem value="44">Trailers</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-row">
                                    <RadioGroup className="flex flex-row items-center justify-center gap-6" defaultValue="public" onValueChange={(value) => setPrivacyStatus(value as PrivacyOption)}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem checked={privacyStatus === "public"} onChange={() => handleChangePrivacy("public")} className="border-white text-white focus:text-[#44b78b]" value="public" id="public" />
                                            <Label htmlFor="public">Public</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem checked={privacyStatus === "private"} onChange={() => handleChangePrivacy("private")} className="border-white text-white focus:text-[#44b78b]" value="private" id="private" />
                                            <Label htmlFor="private">Private</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem checked={privacyStatus === "unlisted"} onChange={() => handleChangePrivacy("unlisted")} className="border-white text-white focus:text-[#44b78b]" value="unlisted" id="unlisted" />
                                            <Label htmlFor="unlisted">Unlisted</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <button className="bg-[#323238] py-2 rounded-sm font-semibold text-white border border-x-0 border-t-0 border-[#525259ad] hover:border-[#44b78bcc] hover:text-[#44b78bcc] transition duration-700 ease-in-out" type="submit">Submit</button>
                            </DialogDescription>
                        </DialogHeader>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
};

export default Dropzone;