import networkx as nx

class RoutePlanner:

    def __init__(self,city_map):
        self.city_map=city_map

    def find_smart_route(self,start_node,end_node,current_battery):
        """It finds routes using dynamic costs (traffic + distance). It finds routes using dynamic costs (traffic + distance)."""
        try:
            """We run the Dijkstra algorithm with our customized cost function."""
            path=nx.dijkstra_path(
                self.city_map.graph,
                source=start_node,
                target=end_node,
                weight=self.city_map.get_cost
            )
            """Calculate total distance"""
            path_length=nx.dijkstra_path_length(
                self.city_map.graph,
                source=start_node,
                target=end_node,
                weight='weight'
            )
            """Battery Check"""
            if(current_battery<path_length):
                return self.replan_with_charging(start_node,end_node)

            return path,path_length

        except nx.NetworkXNoPath:
            return None, float ('inf')

    def replan_with_charging(self,start_node,end_node):
        """When the battery runs low, it includes the nearest charging station in the route.  Find all charging stations"""
        stations=[n for n , d in self.city_map.graph.nodes(Data=True) if d.get('charging')]

        if not stations:
            print("Error:Charging stations not found")
            return None, float('inf')

        """Strategy: First go to the nearest charging station, then to the target. # (Note: In the actual project, all stations are scanned and the most optimal one is selected)"""
        best_station=stations[0]

        path_to_station=nx.dijkstra_path(self.city_map.graph,start_node,best_station)
        path_to_target=nx.dijkstra_path(self.city_map.graph,best_station,end_node)

        """Combine the paths (We use [1:] so that the station node is not duplicated)"""

        full_path=path_to_station+path_to_target[1:]
        return full_path,"Re-routed for Charging"
