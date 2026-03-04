"""Knowledge Graph API endpoints."""

from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from app.data.mock_data import NODES, EDGES
from app.models.schemas import GraphResponse, GraphQueryRequest

router = APIRouter()


@router.get("/", summary="Get full knowledge graph")
async def get_graph(
    node_type: Optional[str] = Query(None, description="Filter by node type"),
    min_risk: Optional[float] = Query(None, ge=0, le=100, description="Minimum risk score"),
    limit: int = Query(100, ge=1, le=500),
):
    """Returns the full global knowledge graph with optional filters."""
    nodes = NODES.copy()
    edges = EDGES.copy()

    if node_type:
        nodes = [n for n in nodes if n["type"] == node_type]
        node_ids = {n["id"] for n in nodes}
        edges = [e for e in edges if e["source"] in node_ids and e["target"] in node_ids]

    if min_risk is not None:
        nodes = [n for n in nodes if n["risk"] >= min_risk]
        node_ids = {n["id"] for n in nodes}
        edges = [e for e in edges if e["source"] in node_ids and e["target"] in node_ids]

    return {
        "nodes": nodes[:limit],
        "edges": edges[:limit * 2],
        "stats": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "node_types": list({n["type"] for n in nodes}),
            "high_risk_count": sum(1 for n in nodes if n["risk"] >= 70),
        },
    }


@router.get("/node/{node_id}", summary="Get specific node with neighborhood")
async def get_node(node_id: str, depth: int = Query(1, ge=1, le=3)):
    """Returns a specific node and its immediate neighborhood."""
    node = next((n for n in NODES if n["id"] == node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found")

    connected_edges = [
        e for e in EDGES
        if e["source"] == node_id or e["target"] == node_id
    ]
    neighbor_ids = set()
    for e in connected_edges:
        neighbor_ids.add(e["source"] if e["source"] != node_id else e["target"])

    neighbors = [n for n in NODES if n["id"] in neighbor_ids]

    return {
        "node": node,
        "edges": connected_edges,
        "neighbors": neighbors,
        "stats": {
            "connection_count": len(connected_edges),
            "neighbor_count": len(neighbors),
            "conflict_count": sum(1 for e in connected_edges if e["type"] in ["conflict", "rivalry"]),
            "alliance_count": sum(1 for e in connected_edges if e["type"] == "alliance"),
        },
    }


@router.get("/path/{source_id}/{target_id}", summary="Find path between two nodes")
async def find_path(source_id: str, target_id: str):
    """Find the shortest relationship path between two entities."""
    src = next((n for n in NODES if n["id"] == source_id), None)
    tgt = next((n for n in NODES if n["id"] == target_id), None)
    if not src:
        raise HTTPException(404, f"Source node '{source_id}' not found")
    if not tgt:
        raise HTTPException(404, f"Target node '{target_id}' not found")

    # Simple BFS path finding
    adjacency: dict[str, list[str]] = {}
    for e in EDGES:
        adjacency.setdefault(e["source"], []).append(e["target"])
        adjacency.setdefault(e["target"], []).append(e["source"])

    from collections import deque
    queue = deque([[source_id]])
    visited = {source_id}

    while queue:
        path = queue.popleft()
        current = path[-1]
        if current == target_id:
            path_nodes = [n for n in NODES if n["id"] in path]
            path_edges = []
            for i in range(len(path) - 1):
                edge = next((e for e in EDGES if
                    (e["source"] == path[i] and e["target"] == path[i+1]) or
                    (e["target"] == path[i] and e["source"] == path[i+1])
                ), None)
                if edge:
                    path_edges.append(edge)
            return {
                "path": path,
                "nodes": path_nodes,
                "edges": path_edges,
                "hop_count": len(path) - 1,
            }
        for neighbor in adjacency.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(path + [neighbor])

    return {"path": [], "nodes": [], "edges": [], "hop_count": -1, "message": "No path found"}


@router.get("/high-risk", summary="Get high-risk entities and relationships")
async def get_high_risk(threshold: float = Query(70, ge=0, le=100)):
    """Returns entities and relationships above risk threshold."""
    high_risk_nodes = [n for n in NODES if n["risk"] >= threshold]
    node_ids = {n["id"] for n in high_risk_nodes}
    high_risk_edges = [
        e for e in EDGES
        if (e["source"] in node_ids or e["target"] in node_ids) and e["weight"] >= threshold
    ]
    return {
        "nodes": high_risk_nodes,
        "edges": high_risk_edges,
        "count": len(high_risk_nodes),
        "threshold": threshold,
    }


@router.get("/stats", summary="Graph statistics")
async def get_stats():
    """Returns comprehensive knowledge graph statistics."""
    from collections import Counter
    type_counts = Counter(n["type"] for n in NODES)
    edge_type_counts = Counter(e["type"] for e in EDGES)
    avg_risk = sum(n["risk"] for n in NODES) / len(NODES)
    avg_influence = sum(n["influence"] for n in NODES) / len(NODES)

    return {
        "total_nodes": len(NODES),
        "total_edges": len(EDGES),
        "node_types": dict(type_counts),
        "edge_types": dict(edge_type_counts),
        "average_risk": round(avg_risk, 2),
        "average_influence": round(avg_influence, 2),
        "max_risk_entity": max(NODES, key=lambda n: n["risk"])["id"],
        "most_influential": max(NODES, key=lambda n: n["influence"])["id"],
    }
