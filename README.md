# Before You Buy

**A little more checking. A little less guessing.**

A listing rarely tells you everything you need to know. Before You Buy helps organize what the seller has said, what is still missing, and what to check when the item arrives.

The flow has three parts: item information, questions for the seller, and arrival checks.

## What the prototype does

- Accepts descriptions, seller replies, and notes entered by the buyer.
- Extracts some explicit text fields using local rules.
- Suggests questions and checklists based on the type of device.
- Leaves the buyer in charge of confirming the information.

## Start here

- [Current functionality and setup](buyer-check/README.md)
- [Product scope](buyer-check/PRODUCT.md)
- [Frontend package and scripts](buyer-check/package.json)

## Current limits

This is a local React prototype. It does not call a language model, read marketplace links, analyze images, make payments, or authenticate a physical device. Rule coverage is incomplete, and every extracted field and prompt needs review.

Inputs are held in page memory and disappear on refresh. Device-, region-, and system-specific instructions still have verification gaps. The public copy was not rerun during this documentation update.

Some linked implementation notes are in Chinese.

## Sources and license

The new presentation material and the owner's original contributions are published under the [MIT license](LICENSE). Third-party material keeps its own licenses and attribution; this license does not relicense it. Existing source and license files have not been changed by this update.

This public snapshot contains 41 source files. The [source manifest](SOURCE_MANIFEST.csv) lists their paths and hashes. Original media, databases, private account records, and unprocessed attachments are outside this public text-and-source snapshot.

Publication and static checks do not establish runtime readiness, customer acceptance, or measured productivity gains.
