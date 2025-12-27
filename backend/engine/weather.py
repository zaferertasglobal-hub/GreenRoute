import random

class WeatherEngine:
    def __init__(self):
# Weather and traffic cost multipliers
        self.states = {
"Sunny": 1.0,
"Rainy": 1.5,
"Snowy": 3.0,
"Stormy": 5.0
}
        self.current_state = "Sunny"

def set_weather(self, state_name):
    """Manually updates the weather."""
    if state_name in self.states:
        self.current_state = state_name
        return self.states[state_name]
    return 1.0

def get_multiplier(self):
    """Returns the cost multiplier of the current state."""
    return self.states.get(self.current_state, 1.0)
