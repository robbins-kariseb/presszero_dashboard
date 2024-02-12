import React from "react";
import QuerySets from "../../../controllers/dashboard.controller";

function WidgetPlatformReviews({items, onPreview}) {
  const [API] = React.useState(new QuerySets());
  const [indexedData, setIndexedData] = React.useState([]);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const init = async () => {
      const dataset = await API.getFeedbackStatistics();

      try {
        setData(dataset.items);
        setIndexedData(dataset.items[dataset.items.length - 1]);
      } catch (ex) {
        console.warn(ex);
      }
    };

    init();
  }, [API]);

  React.useEffect(() => {}, [data, indexedData]);

  return (
    <div className="widget-1x3 widget-container">
      <div className="mini-heading">
        <div className="title-wrapper">
          <h4>Customer Satisfaction</h4>
          <p>Accross PressZero</p>
        </div>
        <div className="title-wrapper">
          <h4>{indexedData.monthYearIndex || "January 2024"}</h4>
        </div>
      </div>
      <div className="mini-statistics">
        <div className="figure-wrapper">
          <h4>{indexedData.totalReviews || "0"}</h4>
          <p>Responses Recieved</p>
        </div>
        <div className="figure-wrapper">
          <h4>
            {Math.floor(
              (indexedData.positive / indexedData.totalReviews) * 100
            ) || "0"}
            %
          </h4>
          <p>Postive</p>
        </div>
      </div>
      <div className="mini-statistics">
        <div className="figure-wrapper">
          <h4>
            {Math.floor(
              (indexedData.neutral / indexedData.totalReviews) * 100
            ) || "0"}
            %
          </h4>
          <p>Neutral</p>
        </div>
        <div className="figure-wrapper">
          <h4>
            {Math.floor(
              (indexedData.negative / indexedData.totalReviews) * 100
            ) || "0"}
            %
          </h4>
          <p>Negative</p>
        </div>
      </div>
    </div>
  );
}

export default WidgetPlatformReviews;
