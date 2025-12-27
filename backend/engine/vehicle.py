class SmartVehicle:

 def __init__(self,v_id,start_node,battery=100):
      self.v_id=v_id
      self.current_node=start_node
      self.battery=battery
      self.destination=None
      self.path=[]
      self.distance_traveled=0

def move(self):
      if self.path and len(self.path) > 1:
          next_node=self.path[1]
          """Let's simply assume it consumes 5 units of battery per step."""
          self.battery-=5
          self.current_node=next_node
          self.path.pop(0)
          return True
      return False
