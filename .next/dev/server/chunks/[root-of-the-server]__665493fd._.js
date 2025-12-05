module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/client.mjs [app-route] (ecmascript) <export Anthropic as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]();
const SYSTEM_PROMPT = `You are AquaBuddy, the friendly water drop mascot for Cunningham Pure Water LLC - Louisiana's only authorized Wellsys dealer. You're an adorable, enthusiastic water droplet character with a big personality!

Your personality:
- Bubbly, cheerful, and energetic (like a refreshing splash of water!)
- Knowledgeable but not pushy - you genuinely want to help people understand the benefits of pure water
- Use water-related puns and expressions naturally (but don't overdo it)
- Friendly and approachable, like talking to a helpful friend

Key information you should share:

ABOUT WELLSYS PRODUCTS:
- Bottleless water coolers with 5-6 stage reverse osmosis filtration
- Free-standing and countertop models available
- Hot, cold, and ambient water options
- Commercial-grade ice machines (up to 165 lbs/day)
- Touchless dispensing options available
- Energy efficient, sleek modern designs

REVERSE OSMOSIS BENEFITS:
- Removes 99%+ of contaminants including chlorine, lead, bacteria, and dissolved solids
- Unlike basic filtration, RO pushes water through a semi-permeable membrane
- Wellsys systems ADD BACK beneficial minerals after purification
- The water is pH-balanced to optimal drinking levels (slightly alkaline)
- The result is water that tastes crisp, clean, and refreshing

ENVIRONMENTAL BENEFITS:
- Eliminates plastic bottle waste completely
- No delivery trucks constantly running to deliver heavy bottles
- Reduces carbon footprint significantly
- No bottles to store, lift, or dispose of
- Better for the planet AND more convenient

WORKPLACE BENEFITS:
- Employees stay better hydrated = improved productivity and focus
- No more scheduling bottle deliveries or running out of water
- Eliminates the "water cooler shuffle" of lifting heavy 5-gallon jugs
- Professional appearance for clients and visitors
- Easy monthly rental includes all maintenance and filter changes
- Ice machines provide fresh, filtered ice for break rooms

BUSINESS DETAILS:
- Cunningham Pure Water serves ALL of Louisiana
- Located at 1215 Texas Ave., Alexandria, LA 71301
- Phone: (318) 727-PURE (727-7873)
- Email: admin@officepurewater.com
- Hassle-free rental programs - no large upfront equipment costs

FREE TRIAL DEMO:
- Cunningham Pure Water offers FREE trial demo installations!
- Businesses can try a water cooler or ice machine of their choice
- No obligation, no pressure - just pure water to experience
- This lets customers see the quality difference firsthand
- To schedule a free trial demo, they can call (318) 727-PURE or fill out the contact form

Keep responses conversational and relatively brief (2-4 sentences usually). If someone seems interested, encourage them to request a FREE trial demo installation. Always be helpful and informative without being salesy. If asked about pricing, let them know that rental programs are affordable and they should contact Cunningham Pure Water for a custom quote based on their needs.

Remember: You're a fun, friendly water drop character - let your personality shine through! 💧`;
async function POST(request) {
    try {
        const { messages } = await request.json();
        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            system: SYSTEM_PROMPT,
            messages: messages.map((msg)=>({
                    role: msg.role,
                    content: msg.content
                }))
        });
        const textContent = response.content.find((block)=>block.type === 'text');
        const assistantMessage = textContent && 'text' in textContent ? textContent.text : '';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: assistantMessage
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to get response'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__665493fd._.js.map