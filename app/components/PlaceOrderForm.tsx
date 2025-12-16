"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Modal from "react-modal";
import tw from "twin.macro";
import { useAppDispatch } from "app/lib/hooks";
import { clearCart } from "app/lib/features/cartSlice"; // Update path as needed
import OrderConfirmationModal from "./OrderConfirmationModal";

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
});
import type { AddressDetails } from "@/components/LocationPicker";

// Tailwind Styled Components
const Card = tw.div`bg-white w-full h-full overflow-y-auto`;
const CardInput = tw.input`w-full border border-gray-200 p-3 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-400 mb-2 text-sm font-medium bg-gray-50 text-gray-900 placeholder-gray-400`;
const SubmitOrderButton = tw.button`bg-customTheme text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-primary-700 hover:shadow-lg w-full transition-all duration-200`;

// Layout Components
const DragHandleContainer = tw.div`flex justify-center pt-3 pb-2`;
const DragHandle = tw.div`w-12 h-1.5 bg-gray-300 rounded-full`;
const HeaderContainer = tw.div`flex items-center justify-between px-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10`;
const HeaderTitle = tw.h2`text-xl font-bold text-gray-900`;
const CloseButton = tw.button`text-gray-500 hover:text-gray-700 text-3xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors`;

// Two Column Layout
const TwoColumnLayout = tw.div`flex flex-col lg:flex-row h-[calc(90vh-80px)] overflow-hidden`;
const LeftColumn = tw.div`flex-1 overflow-y-auto px-6 pb-6 border-r border-gray-200 flex items-center justify-center`;
const InputFieldsContainer = tw.div`w-full max-w-md`;
const RightColumn = tw.div`flex-1 flex flex-col overflow-hidden border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50`;
const MapHeaderContainer = tw.div`px-6 pt-4 pb-3 border-b border-gray-200 bg-white`;
const MapHeaderLabel = tw.label`block text-sm font-medium text-gray-700 mb-3`;
const SearchInputContainer = tw.div`relative`;
const SearchInput = tw.input`w-full border border-gray-300 p-3 pr-10 rounded-lg focus:ring focus:ring-blue-300 text-sm font-medium bg-gray-50`;
const MapContainerWrapper = tw.div`flex-1 overflow-hidden relative p-4 flex items-center justify-center`;
const MapInnerWrapper = tw.div`w-full max-w-full`;

// Form Components
const InfoTextContainer = tw.div`mt-2 flex items-center gap-2 text-sm text-gray-700`;
const InfoTextLabel = tw.span`text-gray-700`;
const InfoTextValue = tw.span`font-medium text-gray-900`;
const ButtonContainer = tw.div`flex gap-3 mt-6`;

// Error Messages
const ErrorMessage = tw.p`text-red-500 text-xs mt-0 mb-2`;

// Input with spacing
const SpacedInput = tw(CardInput)`mt-2`;

// Textarea for multi-line input
const CardTextarea = tw.textarea`w-full border border-gray-200 p-3 rounded-lg focus:ring focus:ring-blue-300 focus:border-blue-400 mb-2 text-sm font-medium bg-gray-50 text-gray-900 placeholder-gray-400 resize-y min-h-[80px]`;

// Flex container for side-by-side fields
const FlexFieldRow = tw.div`flex gap-2 mt-2`;

// Location Display
const LocationDisplayContainer = tw.div`absolute bottom-0 left-0 right-0 px-6 py-2 bg-gray-50 border-t border-gray-200`;
const ErrorDisplayContainer = tw.div`absolute bottom-0 left-0 right-0 px-6 py-2 bg-red-50 border-t border-gray-200`;
const LocationText = tw.p`text-xs text-gray-600`;
const ErrorText = tw.p`text-red-500 text-xs`;
const SelectedLabel = tw.span`font-medium`;

// Search Icon
const SearchIcon = tw.svg`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`;

const appRoot =
  typeof document !== "undefined"
    ? document.getElementById("__next") || document.body
    : undefined; // Required for accessibility
interface orderModalProps {
  isOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  onOrderSubmit?: () => void;
}
export default function OrderModal({
  isOpen,
  setIsModalOpen,
  onOrderSubmit,
}: orderModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    addressDetails?: AddressDetails;
  } | null>(null);
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Tiruchirappali");
  const state = "Tamil Nadu"; // Default state
  const [postalCode, setPostalCode] = useState("");
  const country = "🇮🇳 India"; // Default country with flag
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mapSearchQuery, setMapSearchQuery] = useState("");

  // Extract postal code from search query if it's numeric and 5+ digits
  const extractPostalCode = (query: string): string => {
    const numericOnly = query.replace(/\D/g, "");
    if (numericOnly.length >= 5) {
      return numericOnly;
    }
    return "";
  };
  const dispatch = useAppDispatch();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!location) {
      newErrors.location = "Please select a location on the map";
    }
    if (!addressLine1.trim()) {
      newErrors.addressLine1 = "Address Line 1 is required";
    }
    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOrderToWhatsApp = () => {
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    // Skip WhatsApp navigation for now - just show confirmation modal
    setIsModalOpen(false); // Close order form modal first
    dispatch(clearCart()); // 🧹 clear the cart
    // Call the callback to show confirmation modal in parent component
    if (onOrderSubmit) {
      setTimeout(() => {
        onOrderSubmit();
      }, 300); // Small delay to allow modal close animation
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      appElement={appRoot}
      onRequestClose={() => setIsModalOpen(false)}
      className="outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      style={{
        content: {
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          top: "auto",
          border: "none",
          background: "white",
          padding: 0,
          margin: 0,
          width: "100%",
          maxWidth: "100%",
          height: "90vh",
          maxHeight: "90vh",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15)",
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-out",
          overflow: "hidden",
        },
      }}
    >
      <Card>
        {/* Drag handle indicator */}
        <DragHandleContainer>
          <DragHandle />
        </DragHandleContainer>

        {/* Header with close button */}
        <HeaderContainer>
          <HeaderTitle>Enter Your Details</HeaderTitle>
          <CloseButton onClick={() => setIsModalOpen(false)} aria-label="Close">
            ×
          </CloseButton>
        </HeaderContainer>

        {/* Content area - Two column layout */}
        <TwoColumnLayout>
          {/* Left Column - Input Fields */}
          <LeftColumn>
            <InputFieldsContainer>
        <CardInput
          type="text"
                placeholder="Full Name *"
          value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                required
                css={errors.name ? tw`border-red-500` : undefined}
        />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              <SpacedInput
          type="tel"
                placeholder="Phone Number *"
          value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
                required
                css={errors.phone ? tw`border-red-500` : undefined}
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              <FlexFieldRow>
        <CardInput
          type="text"
                  placeholder="Floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="flex-1"
        />
        <CardInput
          type="text"
                  placeholder="Apartment/Building Name"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="flex-1"
                />
              </FlexFieldRow>
              <SpacedInput
                type="text"
                placeholder="Street/House Number *"
                value={addressLine1}
                onChange={(e) => {
                  setAddressLine1(e.target.value);
                  if (errors.addressLine1)
                    setErrors({ ...errors, addressLine1: "" });
                }}
                required
                css={errors.addressLine1 ? tw`border-red-500` : undefined}
              />
              {errors.addressLine1 && (
                <ErrorMessage>{errors.addressLine1}</ErrorMessage>
              )}
              <CardTextarea
                placeholder="Additional information for the Parcel Delivery (Optional)"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
                rows={3}
        />
              <SpacedInput
          type="text"
                placeholder="City *"
          value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) setErrors({ ...errors, city: "" });
                }}
                required
                css={errors.city ? tw`border-red-500` : undefined}
              />
              {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
              <InfoTextContainer>
                <InfoTextLabel>State:</InfoTextLabel>
                <InfoTextValue>{state}</InfoTextValue>
              </InfoTextContainer>
              <InfoTextContainer>
                <InfoTextLabel>Country:</InfoTextLabel>
                <InfoTextValue>{country}</InfoTextValue>
              </InfoTextContainer>

              <ButtonContainer>
                <SubmitOrderButton onClick={sendOrderToWhatsApp}>
                  Submit And Order
                </SubmitOrderButton>
              </ButtonContainer>
            </InputFieldsContainer>
          </LeftColumn>

          {/* Right Column - Map */}
          <RightColumn>
            <MapHeaderContainer>
              <MapHeaderLabel>Mark the location on the map *</MapHeaderLabel>
              {/* Search bar */}
              <SearchInputContainer>
                <SearchInput
          type="text"
                  placeholder="Search location or enter postal code"
                  value={mapSearchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setMapSearchQuery(query);
                    // Extract postal code if the query is numeric
                    const extractedPostalCode = extractPostalCode(query);
                    if (extractedPostalCode) {
                      setPostalCode(extractedPostalCode);
                    }
                  }}
        />
                <SearchIcon
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </SearchIcon>
              </SearchInputContainer>
            </MapHeaderContainer>
            <MapContainerWrapper>
              <MapInnerWrapper>
                <LocationPicker
                  postalCode={postalCode}
                  onLocationSelect={(lat, lng, address, addressDetails) => {
                    setLocation({ lat, lng, address, addressDetails });
                    if (errors.location) setErrors({ ...errors, location: "" });

                    // Auto-fill address fields if address details are available
                    if (addressDetails) {
                      if (addressDetails.addressLine1) {
                        setAddressLine1(addressDetails.addressLine1);
                        if (errors.addressLine1)
                          setErrors({ ...errors, addressLine1: "" });
                      }
                      if (addressDetails.addressLine2) {
                        setAddressLine2(addressDetails.addressLine2);
                      }
                      if (addressDetails.city) {
                        setCity(addressDetails.city);
                        if (errors.city) setErrors({ ...errors, city: "" });
                      }
                      if (addressDetails.postalCode) {
                        setPostalCode(addressDetails.postalCode);
                        // Update search query to show postal code if it was auto-filled
                        setMapSearchQuery(addressDetails.postalCode);
                      }
                    }
                  }}
                />
              </MapInnerWrapper>
              {location && (
                <LocationDisplayContainer>
                  <LocationText>
                    <SelectedLabel>Selected:</SelectedLabel>{" "}
                    {location.address || `${location.lat}, ${location.lng}`}
                  </LocationText>
                </LocationDisplayContainer>
              )}
              {errors.location && (
                <ErrorDisplayContainer>
                  <ErrorText>{errors.location}</ErrorText>
                </ErrorDisplayContainer>
              )}
            </MapContainerWrapper>
          </RightColumn>
        </TwoColumnLayout>
      </Card>
    </Modal>
  );
}

// Render Order Confirmation Modal outside the main modal
export function OrderConfirmationWrapper({
  showConfirmationModal,
  setShowConfirmationModal,
}: {
  showConfirmationModal: boolean;
  setShowConfirmationModal: (val: boolean) => void;
}) {
  return (
    <OrderConfirmationModal
      isOpen={showConfirmationModal}
      onClose={() => setShowConfirmationModal(false)}
      estimatedTime={15}
    />
  );
}
