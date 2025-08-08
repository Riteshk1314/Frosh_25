"use client";

import React, { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

type GetTix = {
	success: boolean,
	data: {
		buyer: string,
		buyerIMG: string,
		event: string,
		passStatus: string,
        isScanned: boolean,
        timeScanned: string,
	}
};

export default function AdminQRScanner() {
	const [isScanning, setIsScanning] = useState(false);
	const [verificationStatus, setVerificationStatus] = useState<string | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [passInfo, setPassInfo] = useState<GetTix | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentPassId, setCurrentPassId] = useState<{ passUUID: string } | null>(null);
	const [isPending, setIsPending] = useState(false);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const scannerRef = useRef<QrScanner | null>(null);

	useEffect(() => {
		if (isScanning && videoRef.current) {
			scannerRef.current = new QrScanner(
				videoRef.current,
				(result) => {
					if (result) {
						handleScan(result.data);
						if (scannerRef.current) {
							scannerRef.current.stop();
						}
					}
				},
				{
					returnDetailedScanResult: true,
					highlightScanRegion: true,
					highlightCodeOutline: true,
				},
			);

			scannerRef.current.start().catch((err) => {
				console.error("Failed to start scanner:", err);
				setError(
					"Failed to access camera. Please check permissions and try again.",
				);
			});
		}

		return () => {
			if (scannerRef.current) {
				scannerRef.current.destroy();
			}
		};
	}, [isScanning]);

	const handleScan = async (result: string) => {
		setIsScanning(false);
		setIsPending(true);
		try {
			const passUUID = result.trim();
			console.log("Parsed QR Code:", { passUUID });
			await getPassInfo(passUUID);
		} catch (error) {
			console.error("Error parsing QR code:", error);
			setError("Failed to process QR code");
			setIsPending(false);
			return;
		}
	};

	const getPassInfo = async (passUUID: string): Promise<void> => {
		console.log(passUUID)
		try {
			const response = await fetch(`http://localhost:8080/api/getTix`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ passUUID }),
			});
			console.log(response)

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setPassInfo(data);
				setCurrentPassId({ passUUID });
				setIsDialogOpen(true);
				setIsPending(false);
			} else if (response.status === 404) {
				setVerificationStatus("Invalid Pass");
				setError("Invalid pass ID provided.");
				setIsPending(false);
			} else {
				throw new Error(
					`Verification failed with status ${response.status}`,
				);
			}
		} catch (error) {
			console.error("Error checking pass:", error);
			setError("Failed to verify pass. Please try again.");
			setIsPending(false);
		}
	};

	const handleAccept = async () => {
		setIsPending(true);
		try {
			const response = await fetch(`http://localhost:8080/Accept`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
				body: JSON.stringify({ passUUID: currentPassId?.passUUID }),
			});

			if (response.ok) {
				// Update the pass info to reflect it's now scanned
				if (passInfo) {
					setPassInfo({
						...passInfo,
						data: {
							...passInfo.data,
							isScanned: true,
							timeScanned: new Date().toISOString(),
						}
					});
				}
				
				setVerificationStatus(
					`✅ Pass successfully accepted for ${passInfo?.data.buyer}`
				);
				
				// Close dialog after a short delay to show success
				setTimeout(() => {
					setIsDialogOpen(false);
					resetScanner();
				}, 2000);
			} else {
				throw new Error(
					`Accept failed with status ${response.status}`,
				);
			}
		} catch (error) {
			console.error(`Error accepting pass:`, error);
			setError(`Failed to accept pass. Please try again.`);
			setIsDialogOpen(false);
			resetScanner();
		} finally {
			setIsPending(false);
		}
	};

	const resetScanner = () => {
		setIsScanning(true);
		setPassInfo(null);
		setCurrentPassId(null);
		setError(null);
		setVerificationStatus(null);
		setIsPending(false);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
			<h1 className="text-3xl font-bold mb-6 text-foreground">
				Admin QR Scanner
			</h1>

			<div className={`w-full max-w-md ${isPending ? "opacity-40" : ""}`}>
				{isScanning ? (
					<Card className="relative overflow-hidden">
						<CardContent className="p-0">
							<div className="relative aspect-square">
								<video
									ref={videoRef}
									className="w-full h-full object-cover rounded-lg"
								/>
								<div className="absolute inset-0 border-4 border-primary rounded-lg pointer-events-none" />
							</div>
						</CardContent>
					</Card>
				) : (
					<Button
						onClick={() => setIsScanning(true)}
						className="w-full"
						disabled={isPending}
					>
						{isPending ? "Processing..." : verificationStatus ? "Scan More" : "Start Scanning"}
					</Button>
				)}
			</div>

			{error && <p className="mt-4 text-destructive text-center">{error}</p>}

			{verificationStatus && (
				<div className={`mt-4 p-3 rounded-md ${
					verificationStatus.includes("✅") 
						? "bg-green-100 border border-green-400" 
						: "bg-blue-100 border border-blue-400"
				}`}>
					<p className={`text-center font-medium ${
						verificationStatus.includes("✅") 
							? "text-green-700" 
							: "text-blue-700"
					}`}>
						{verificationStatus}
					</p>
				</div>
			)}

			{(verificationStatus || error) && (
				<Button
					variant="outline"
					onClick={resetScanner}
					className="mt-4"
				>
					Scan Again
				</Button>
			)}

			<Dialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			>
				<DialogContent className="bg-white text-black max-w-md">
					<DialogHeader>
						<DialogTitle>Pass Information</DialogTitle>
						<Button
							className="absolute right-4 top-4"
							variant="ghost"
							size="sm"
							onClick={() => setIsDialogOpen(false)}
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</DialogHeader>
					{passInfo && (
						<div className="py-4 space-y-4">
							{/* Buyer Information */}
							<div className="flex items-center space-x-3">
								{passInfo.data.buyerIMG && (
									<img 
										src={passInfo.data.buyerIMG} 
										alt="Buyer"
										className="w-12 h-12 rounded-full object-cover"
									/>
								)}
								<div>
									<p className="text-sm text-gray-600">Buyer</p>
									<p className="font-semibold">{passInfo.data.buyer}</p>
								</div>
							</div>

							{/* Event Information */}
							<div>
								<p className="text-sm text-gray-600">Event</p>
								<p className="font-semibold">{passInfo.data.event}</p>
							</div>

							{/* Pass Status */}
							<div>
								<p className="text-sm text-gray-600">Pass Status</p>
								<p className="font-semibold capitalize">{passInfo.data.passStatus}</p>
							</div>

							{/* Scan Status Warning */}
							{passInfo.data.isScanned && (
								<div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-md">
									<p className="text-red-700 font-semibold">
										⚠️ This pass has already been scanned
									</p>
									{passInfo.data.timeScanned && (
										<p className="text-red-600 text-sm mt-1">
											Scanned at: {new Date(passInfo.data.timeScanned).toLocaleString()}
										</p>
									)}
								</div>
							)}
						</div>
					)}
					<DialogFooter>
						{passInfo && !passInfo.data.isScanned ? (
							<Button
								onClick={() => handleAccept()}
								disabled={isPending}
								className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
							>
								{isPending ? "Accepting..." : "Accept Pass"}
							</Button>
						) : passInfo && passInfo.data.isScanned && verificationStatus?.includes("✅") ? (
							<div className="flex flex-col items-center space-y-2">
								<div className="text-green-600 font-semibold text-center">
									✅ Pass Successfully Accepted!
								</div>
								<Button
									variant="outline"
									onClick={() => {
										setIsDialogOpen(false);
										resetScanner();
									}}
									className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
								>
									Continue Scanning
								</Button>
							</div>
						) : (
							<Button
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
								className="bg-gray-500 hover:bg-gray-600 text-white"
							>
								Close
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}