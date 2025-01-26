from flask import Flask, jsonify, request, render_template
import numpy as np
import plotly.graph_objects as go
import plotly.io as pio
import plotly.graph_objects as go
import scipy.stats as stats
import numpy as np
import re


'''
Takes as input a reference dataframe with reference means, variances and ranges for
biomarkers, and a test_results from a user (as pd dataframes), and generates plots
for the user biomarkers results compared to the population distribution and mean
'''

def create_and_display_plots(reference_df,test_results_df):

    all_figures = []

    for i in range(len(reference_df)):  # Loop through biomarkers

        # Get reference values and ranges
        mean = reference_df["Mean"][i] 
        reference_range = reference_df["Reference values"][i]
        variance = reference_df["Variance"][i]
        std_dev = np.sqrt(variance)

        # Get user results for a particular biomarker
        user_data_point = test_results_df["Results"][i]
        user_flag = test_results_df["Flags"][i]

        # Set plot colors if user biomarker result is significantly out of range (red if it is, green if not)
        if user_flag == "L":
            hist_color = 'rgba(0, 0, 0, 0.29)'
            curve_color = 'rgba(241, 66, 66, 0.8)'
            area_color = 'rgba(241, 66, 66, 0.8)'
        else:
            hist_color = 'rgba(133, 233, 116, 0.8)'
            curve_color = 'rgba(133, 233, 116, 0.8)'
            area_color = 'rgba(133, 233, 116, 0.8)'


        if reference_range[0] == ">" :
            limit_type = "upper"
            limit = re.findall(r'[<>](\S+)', reference_range) # Regex to capture what comes after < or >
        elif reference_range[0] == "<":
            limit_type = "lower"
            limit = re.findall(r'[<>](\S+)', reference_range) # Regex to capture what comes after < or >
        else:
            limit_type = "range"
            if re.search(r'–', reference_range):
                limit = reference_range.split("–")
            else:
                limit = reference_range.split("-")

        # Generate 1000 data points
        data = np.random.normal(mean, std_dev, 1000)  

        # Create smoothed normal distribution curve
        x_vals = np.linspace(mean - 4*std_dev, mean + 4*std_dev, 1000)
        y_vals = stats.norm.pdf(x_vals, mean, std_dev)

        smoothed_curve = go.Scatter(
            x=x_vals.tolist(),
            y=y_vals.tolist(),
            mode='lines',
            fill='tozeroy',  # Fill the area under the curve to zero
            fillcolor=area_color,  # Fill color
            name=None,
            line=dict(color=curve_color, width=2)
        )

        # Create the histogram
        hist_data = go.Histogram(
            x=data.tolist(),
            nbinsx=10,
            histnorm='probability density',
            opacity=0.7,
            marker=dict(
                color='rgba(0, 0, 0, 0.29)',
                pattern=dict(
                    shape='/'
                )
            )
        )
        print()

        # Add a specific data point on the smoothed curve
        user_data_point = float(user_data_point)
        user_y_val = stats.norm.pdf(float(user_data_point), mean, std_dev)
        data_point = go.Scatter(
            x=[user_data_point],  # The x-coordinate is the user's specific test result
            y=[user_y_val],  # The y-coordinate is the corresponding probability density value
            mode='markers+text',  # Use markers and display text alongside
            marker=dict(
                size=15,  # Marker size
                color='gold',  # Marker color for visibility
                symbol='circle'  # Use a circle to represent the marker
            ),
            text='Your test result',  # Text to display next to the marker
            textposition='top center',  # Position the text above the marker
            textfont=dict(
                family='Arial, sans-serif',  # Font family (can choose any web-safe font)
                size=14,  # Font size
                color='black'  # Font color
            ),
            name='Your test result'  # Label for the legend
        )

        # Combine histogram, smoothed curve, and data point
        fig = go.Figure(data=[

            hist_data,
            smoothed_curve,
            data_point
            
            
            ])

        # Initialize shapes list (for custom shapes based on range type for the biomarker)
        shapes = []
        
        # Dict for defining the upper or lower limit shape
        limit_dict = dict(
                    type="line",
                    x0=limit[0],
                    x1=limit[0],
                    y0=0,
                    y1=max(y_vals),  # Adjust based on your y-axis range
                    line=dict(color="red", width=2, dash="dash"))

        # Set the shapes (the lines indicating the limits that for which youre seen as way above average or way below average) based on the limit_type
        if limit_type == "upper":
            shapes = [limit_dict]
        elif limit_type == "lower":
            shapes = [limit_dict]
        elif limit_type == "range":
            shapes = [limit_dict,dict(
                    type="line",
                    x0=limit[1],
                    x1=limit[1],
                    y0=0,
                    y1=max(y_vals),  # Adjust based on your y-axis range
                    line=dict(color="red", width=2, dash="dash"))]

        # Custom layout
        fig.update_layout(
            title=dict(
            text=reference_df["vitals_plot_title"][i],  # Use row for title dynamically
            x=0.5,  # Center the title
            xanchor='center',  # Anchor the title at the center
            yanchor='top',  # Anchor it at the top
            font=dict(
            family="Roboto, sans-serif",  # Minimalistic and clean font
            size=24,  # Slightly larger for prominence
            color="black")), 
            xaxis_title=dict(
                text=reference_df["Units"][i],
                font=dict(
                family="Roboto, sans-serif",  # Matching font for x-axis
                size=16)),        
            bargap=0.2,  # Spacing between bars in the histogram
            plot_bgcolor='rgba(0, 0, 0, 0)', 
            paper_bgcolor='rgba(0, 0, 0, 0)', 
            xaxis=dict(showgrid=False, tickfont=dict(
            family='Roboto, sans-serif',  # Font family for tick labels
            size=15,  # Font size for tick labels
            color='black'  # Font color for tick labels
            )),  
            yaxis=dict(showgrid=False, showticklabels=False),
            showlegend=False,  # Remove the legend
            shapes=shapes
        )

        # Save plot as html locally
        # fig.write_html(os.path.join(app.config['PLOTLY_OUTPUT_FOLDER'], "".join([file_name, ".hmtl"])))

        config = {'displayModeBar': False}

        
        #print(f"saving figure {i}")
        #fig.write_image(f"figure_{i}.png")

        fig_json = fig.to_dict()
        fig_json['config'] = config 
       
        all_figures.append(fig_json)        

    return(all_figures)
