# Strapi plugin paywall

## Install the plugin

    npm i git@bitbucket.org:x2-investa-nl/strapi-plugin-paywall.git 

### Go to the admin panel.

Open plugins's settings and add rules for content types.

Set permissions for public role. Open the public role. Then click "paywall". Turn on "getcontent", "visit" and "setvisitorid" checkboxes.

## Copy this to the head of your sites frontend:

    <script src="${strapi.backendURL}/paywall.js"></script>
          

## Wrap container of content field with
        
    <div data-paywall="true">...</div>
        
## Add this code for getting paywalled content
        
    window.paywallId.then(async (id) => {
        if (id) {
          this.article.<field-trimmed-by-paywall> = await this.$strapi.$http.$get(\`/paywall/content/<modelName>/$\{this.$route.params.id}/$\{id}\`)
        }
    });

