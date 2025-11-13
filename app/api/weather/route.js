import { NextResponse } from "next/server";
import { getWeatherByPincode, getForecastByPincode } from "@/lib/weather";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get("pincode");
    if (!pincode) {
      return NextResponse.json({ message: "pincode is required" }, { status: 400 });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { 
          current: null, 
          forecast: [],
          message: "Weather API key not configured. Please add OPENWEATHER_API_KEY to your .env.local file."
        },
        { status: 200 }
      );
    }

    const [current, forecast] = await Promise.all([
      getWeatherByPincode(pincode),
      getForecastByPincode(pincode),
    ]);

    return NextResponse.json({ current, forecast: forecast || [] });
  } catch (error) {
    console.error("GET /api/weather error", error);
    return NextResponse.json(
      { 
        current: null, 
        forecast: [],
        message: error.message || "Unable to fetch weather. Please check your pincode and API key."
      },
      { status: 200 }
    );
  }
}

