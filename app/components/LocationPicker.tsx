"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import tw from "twin.macro";
import Modal from "react-modal";
import { IoCloseSharp } from "react-icons/io5";

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface AddressDetails {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  country?: string;
  fullAddress?: string;
}

interface LocationPickerProps {
  onLocationSelect: (
    lat: number,
    lng: number,
    address?: string,
    addressDetails?: AddressDetails
  ) => void;
  initialPosition?: [number, number];
  showFullScreenButton?: boolean;
  postalCode?: string;
  onMapCenterChange?: (center: [number, number]) => void;
}

const MapContainerStyled = tw.div`w-[90%] h-[350px] rounded-lg overflow-hidden border border-gray-200 mx-auto shadow-sm relative`;
const FullScreenMapContainer = tw.div`w-full h-full relative mx-auto`;
const FullScreenIconButton = tw.button`absolute top-2 right-2 z-[1000] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center`;
const CloseButton = tw.button`absolute top-4 right-4 z-[1000] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors`;

// Component to update map center dynamically
function MapCenterUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

function LocationMarker({
  position,
  setPosition,
  onLocationSelect,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition: [number, number] = [lat, lng];
      setPosition(newPosition);
      onLocationSelect(lat, lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({
  onLocationSelect,
  initialPosition,
  showFullScreenButton = true,
  postalCode,
  onMapCenterChange,
}: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition || null
  );

  const [isFullScreen, setIsFullScreen] = useState(false);

  // Default center to Tiruchirappalli, Tamil Nadu, India
  const defaultCenter: [number, number] = [10.7905, 78.7047];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);

  const appRoot =
    typeof document !== "undefined"
      ? document.getElementById("__next") || document.body
      : undefined;

  const handleLocationSelect = async (lat: number, lng: number) => {
    // Update map center immediately when location is selected
    const newCenter: [number, number] = [lat, lng];
    setMapCenter(newCenter);
    setPosition(newCenter);

    try {
      // Reverse geocoding to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      const address = data.display_name || `${lat}, ${lng}`;

      // Parse address details
      const addr = data.address || {};
      const addressDetails: AddressDetails = {
        addressLine1: addr.road
          ? `${addr.house_number || ""} ${addr.road}`.trim()
          : addr.house_number || addr.building || "",
        addressLine2: addr.suburb || addr.neighbourhood || "",
        city: addr.city || addr.town || addr.village || addr.county || "",
        postalCode: addr.postcode || "",
        state: addr.state || addr.region || "",
        country: addr.country || "",
        fullAddress: address,
      };

      onLocationSelect(lat, lng, address, addressDetails);
    } catch (error) {
      onLocationSelect(lat, lng, `${lat}, ${lng}`);
    }
  };

  // Geocode postal code when it changes
  useEffect(() => {
    if (postalCode && postalCode.trim().length >= 5) {
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(
              postalCode.trim()
            )}&country=India&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            const newCenter: [number, number] = [lat, lng];
            // Update both mapCenter and position to ensure map centers properly
            setMapCenter(newCenter);
            setPosition(newCenter);
            if (onMapCenterChange) {
              onMapCenterChange(newCenter);
            }
            // Automatically select this location
            handleLocationSelect(lat, lng);
          }
        } catch (error) {
          console.error("Error geocoding postal code:", error);
        }
      }, 1000); // Debounce for 1 second
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postalCode]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          // setUserLocation(userPos);
          if (!postalCode && !initialPosition) {
            setMapCenter(userPos);
            setPosition(userPos);
            handleLocationSelect(userPos[0], userPos[1]);
          }
        },
        () => {
          // If geolocation fails, use default center only if no postal code
          if (!postalCode) {
            setMapCenter(defaultCenter);
          }
        }
      );
    } else {
      if (!postalCode) {
        setMapCenter(defaultCenter);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMap = (height: string = "100%") => {
    // Use current position if available, otherwise use mapCenter
    const center = position || mapCenter;
    const zoom = position ? 15 : 13;

    return (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: "100%" }}
        scrollWheelZoom={true}
        key={isFullScreen ? "fullscreen" : "normal"}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterUpdater center={center} zoom={zoom} />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={handleLocationSelect}
        />
      </MapContainer>
    );
  };

  return (
    <>
      <MapContainerStyled>
        {renderMap()}
        {showFullScreenButton && (
          <FullScreenIconButton
            onClick={() => setIsFullScreen(true)}
            title="Open Map in Full Screen"
            aria-label="Open Map in Full Screen"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </FullScreenIconButton>
        )}
      </MapContainerStyled>

      <Modal
        isOpen={isFullScreen}
        onRequestClose={() => setIsFullScreen(false)}
        appElement={appRoot}
        className="outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center"
        style={{
          content: {
            position: "relative",
            inset: "auto",
            border: "none",
            background: "transparent",
            padding: 0,
            width: "100%",
            height: "100%",
            maxWidth: "100vw",
            maxHeight: "100vh",
          },
        }}
      >
        <FullScreenMapContainer>
          <CloseButton onClick={() => setIsFullScreen(false)}>
            <IoCloseSharp className="text-2xl text-gray-800" />
          </CloseButton>
          {renderMap("100vh")}
        </FullScreenMapContainer>
      </Modal>
    </>
  );
}
