from fastapi import FastAPI
from engine.graph import CityMap
from engine.algorithms import RoutePlanner
from engine.vehicle import SmartVehicle
from fastapi.middleware.cors import CORSMiddleware

app= FastAPI()
#---Simulation Preparation---
#---Create City---

dortmund_map=CityMap()
dortmund_map.add_intersection("Ware_House",0,0)
dortmund_map.add_intersection("Junction_A",10,20)
dortmund_map.add_intersection("Charge_Station1",20,40,is_charging=True)
dortmund_map.add_intersection("Target_Customer",50,50)

dortmund_map.add_road("Ware_House","Junction_A",15)
dortmund_map.add_road("Junction_A","Charge_Station1",10)
dortmund_map.add_road("Charge_Station1","Target_Customer",30)

planner=RoutePlanner(dortmund_map)

# --- API (Endpoints) ---

@app.get("/")

def Home():
    return {"message": "Greenwood Simulation API is working "}

@app.get("/calculate_route/{vehicle_id}")

def get_route(vehicle_id:str, battery:int):
    #---Calculate the best route for the vehicle.---
    path,cost=planner.find_smart_route("Ware-House","Target_Customer",battery)

    return{
        "vehicle_id":vehicle_id,
        "path":path,
        "cost":cost,
        "status":"Success" if path else "No Path Found"
          }

@app.post("/update_traffic")
def update_traffic(start: str, end: str, factor: float):
    dortmund_map.update_traffic(start,end,factor)
    return {"message": f"The traffic multiplier between {start} and {end} has been updated to {factor}."}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
