import { BetaAnalyticsDataClient } from "@google-analytics/data";

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function getPopularPosts() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`, // safer than NEXT_PUBLIC
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    metrics: [{ name: "screenPageViews" }], // consider "pageViews"
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "pagePath",
              stringFilter: {
                matchType: "BEGINS_WITH",
                value: "/blogs/",
              },
            },
          },
          {
            notExpression: {
              filter: {
                fieldName: "pagePath",
                stringFilter: {
                  matchType: "CONTAINS",
                  value: "/category/",
                },
              },
            },
          },
          {
            notExpression: {
              filter: {
                fieldName: "pagePath",
                stringFilter: {
                  matchType: "CONTAINS",
                  value: "/preview",
                },
              },
            },
          },
        ],
      },
    },
    metricFilter: {
      filter: {
        fieldName: "screenPageViews",
        numericFilter: {
          operation: "GREATER_THAN",
          value: {
            int64Value: "5",
          },
        },
      },
    },
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 10,
  });

  if (!response.rows) return [];

  return response.rows
    .map((row) => {
      const pagePath = row.dimensionValues?.[0]?.value ?? "";
      const pageTitle = row.dimensionValues?.[1]?.value ?? "";

      return {
        path: pagePath,
        title: pageTitle.split(" | ")[0],
        views: row.metricValues?.[0]?.value ?? "0",
      };
    })
    .filter(
      (post, index, self) =>
        // Remove duplicates based on path
        index === self.findIndex((p) => p.path === post.path)
    ) as Array<{ path: string; title: string; views: string }>;
}
