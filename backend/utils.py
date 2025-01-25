import numpy as np
import plotly.graph_objects as go

import random

def create_distribution():

    print("create_distributions_called")
    # Generate data for a normal distribution
    mean = 0
    std_dev = 1
    num_points = 1000

    # Create an array of points from -4 to 4 (standard normal range)
    x = np.linspace(-4, 4, num_points)

    # Generate the corresponding y values (normal distribution)
    y = (1 / (std_dev * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mean) / std_dev) ** 2)
    
    random_index = random.randint(0, num_points - 1)
    random_x = x[random_index]
    random_y = y[random_index]

    # Create a Plotly figure
    fig = go.Figure()

    # Add a line trace for the normal distribution
    fig.add_trace(go.Scatter(x=x, y=y,
                            fill='tozeroy',  # Fill area under the plot with blue color
                            fillcolor='rgba(0, 0, 255, 0.3)',  # Blue with some transparency,
                            mode='lines',
                            name='Normal Distribution')
                  )
    
    fig.update_layout(
        shapes = [
            # Vertical line at x = 1.5
            dict(
                type="line",
                x0=1.5,
                x1=1.5,
                y0=0,
                y1=max(y),  # You can adjust this based on your y-axis range
                line=dict(color="red", width=2, dash="dash")
            ),
            # Vertical line at x = -1.5
            dict(
                type="line",
                x0=-1.5,
                x1=-1.5,
                y0=0,
                y1=max(y),  # Adjust y-range
                line=dict(color="blue", width=2, dash="dash")
            )
        ],
        plot_bgcolor='rgba(0, 0, 0, 0)', 
        paper_bgcolor='rgba(0, 0, 0, 0)', 
        xaxis=dict(showgrid=False),  
        yaxis=dict(showgrid=False, showticklabels=False),
        showlegend=False  # Remove the legend
    )
    
    # Add random point as a scatter trace
    fig.add_trace(go.Scatter(
        x=[random_x], y=[random_y], mode='markers', name='Random Point',
        marker=dict(color='yellow', size=10, line=dict(color='black', width=2))
    ))
    
    config = {'displayModeBar': False}


    # Show the plot
    return fig.to_html(full_html=False, config=config)
