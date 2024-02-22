import { google, youtube_v3 } from 'googleapis';
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs'
import { Readable } from 'node:stream';

interface VideoUploadOptions {
  accessToken: string;
  title: string;
  description: string;
  categoryId?: string;
  privacyStatus?: "public" | "private" | "unlisted";
}

const uploadVideoToYouTube = async (file: File, options: VideoUploadOptions) => {
  const { accessToken, title, description, categoryId, privacyStatus } = options;

  console.log(accessToken, title, description, categoryId, privacyStatus)

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const videoMetadata = {
    snippet: {
      title,
      description,
      categoryId,
    },
    status: {
      privacyStatus,
    },
  };

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  try {
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: videoMetadata,
      media: {
        mimeType: 'video/*',
        body: stream,
      },
    });
    console.log('Video uploaded successfully:', response.data);
    return response;
  } catch (error: any) {
    console.error('Error uploading video:', error.message);
    throw new Error('Error uploading video');
  }
};

type ResponseData = {
  videoId?: string | null | undefined;
  error?: string;
  message?: string;
}

export async function POST(
  req: NextRequest,
  res: NextResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return new NextResponse("Method not allowed", {
      status: 405
    }).json()
  }

  const formData = await req.formData()

  const videoFile = formData.get('video');
  const accessToken = formData.get('accessToken')
  const title = formData.get("title")
  const description = formData.get("description")
  const categoryId = formData.get("category")
  const privacyStatus = formData.get("privacyStatus")

  if (!videoFile) {
    return new NextResponse("Video is missing", {
      status: 405
    }).json()
  }

  const options: VideoUploadOptions = {
    accessToken: accessToken!.toString(),
    title: title!.toString(),
    description: description!.toString(),
    categoryId: categoryId?.toString(),
    privacyStatus: privacyStatus as "public" | "private" | "unlisted" | undefined,
  };

  try {
    const videoData = await uploadVideoToYouTube(videoFile as unknown as File, options);
    console.log(videoData)
    return new NextResponse("Mega essa", {
      status: 200
    }).json()
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    }).json()
  }
}