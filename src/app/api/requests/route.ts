import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, materialId, requestedBy, quantity, reason } = body;

    const parsedQty = Number(quantity);
    const pId = Number(projectId);
    const mId = Number(materialId);
    const uId = Number(requestedBy);

    // Validation: Positive integer quantity
    if (!parsedQty || parsedQty <= 0 || !Number.isInteger(parsedQty)) {
      return NextResponse.json(
        { error: "Quantity must be a positive whole number." },
        { status: 400 }
      );
    }

    // Fetch current local inventory
    const localStock = await db.inventory.findUnique({
      where: {
        projectId_materialId: {
          projectId: pId,
          materialId: mId,
        },
      },
    });

    const currentQty = localStock ? localStock.quantity : 0;
    let transferRecommendation = null;

    // Rule: Search cross-project transfer if local stock is insufficient
    if (parsedQty > currentQty) {
      const alternativeStock = await db.inventory.findFirst({
        where: {
          materialId: mId,
          projectId: { not: pId },
          quantity: { gte: parsedQty },
        },
        include: { project: true },
      });

      if (alternativeStock) {
        transferRecommendation = {
          sourceProjectId: alternativeStock.projectId,
          sourceProjectName: alternativeStock.project.name,
          availableQuantity: alternativeStock.quantity,
        };
      }
    }

    // Create record
    const newRequest = await db.materialRequest.create({
      data: {
        projectId: pId,
        materialId: mId,
        requestedBy: uId,
        quantity: parsedQty,
        reason: reason || "Site requirement",
        status: "PENDING",
      },
      include: {
        project: true,
        material: true,
        user: true,
      },
    });

    // Write Audit Log
    await db.auditLog.create({
      data: {
        requestId: newRequest.id,
        userId: uId,
        action: "CREATE_REQUEST",
        details: `Requested ${parsedQty} units for Project ${pId}`,
      },
    });

    return NextResponse.json(
      {
        request: newRequest,
        localStockAvailable: currentQty,
        isStockSufficient: currentQty >= parsedQty,
        transferRecommendation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await db.materialRequest.findMany({
      include: {
        project: true,
        material: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
  }
}