let activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || "development"

console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
    path: `.env.${activeEnv}`,
})

module.exports = {
    plugins: [
        'gatsby-plugin-react-helmet',
        {
            resolve: `gatsby-plugin-gtag`,
            options: {
                trackingId: `UA-2319330-13`,
                head: true,
                anonymize: false,
            },
        },
    ]
}
