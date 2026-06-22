# Token Usage

Owner: Lane / Mojo Lab Operator

Purpose: hourly token usage log for Codex-interface activity and Claude CLI activity. Codex exact token fields are currently unavailable through the readable thread API, so Codex rows may be estimates. Claude rows use exact local JSONL usage fields when available.

## Schema

Append rows to the table below. Do not change column names without updating the daily HTML builder automation.

| logged_at_mdt | window_start_mdt | window_end_mdt | interface | room_or_session | room_title_or_cwd | input_tokens | output_tokens | cache_create_tokens | cache_read_tokens | total_tokens | confidence | notes |
| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 2026-06-22 00:56:15 | 2026-06-21 23:56:15 | 2026-06-22 00:56:15 | Codex | 019eedc7-9e34-78c2-9792-5e8c1787fd46 | Mojo Lab Admin (Lane) | 35 | 150 | 0 | 0 | 185 | estimate-visible | |
| 2026-06-22 00:56:15 | 2026-06-21 23:56:15 | 2026-06-22 00:56:15 | Codex | 019eedc1-b201-7fb2-a5bd-9e1c6957fa39 | Executive Assistant (Paige) | 15 | 35 | 0 | 0 | 50 | estimate-visible | |
| 2026-06-22 01:57:22 | 2026-06-22 00:57:22 | 2026-06-22 01:57:22 | Codex | (aggregate) | (aggregate) | 0 | 0 | 0 | 0 | 0 | no-activity | |
| 2026-06-22 01:57:22 | 2026-06-22 00:57:22 | 2026-06-22 01:57:22 | Claude | (aggregate) | (aggregate) | 0 | 0 | 0 | 0 | 0 | no-activity | |
| 2026-06-22 02:59:17 | 2026-06-22 01:59:17 | 2026-06-22 02:59:17 | Codex | 019eec2c-bb6b-7b03-8c97-f73cf63dc7a8 | Autonomy Engineer (Tess) | 280 | 620 | 0 | 0 | 900 | estimate-visible | |
| 2026-06-22 04:00:18 | 2026-06-22 03:00:18 | 2026-06-22 04:00:18 | Codex | 019ee0cf-d067-7e60-92ae-41ea66a75746 | AI Architect (Vik) | 145 | 115 | 0 | 0 | 260 | estimate-visible | |
| 2026-06-22 05:00:19 | 2026-06-22 04:00:19 | 2026-06-22 05:00:19 | Codex | (aggregate) | (aggregate) | 0 | 0 | 0 | 0 | 0 | no-activity | |
| 2026-06-22 05:00:19 | 2026-06-22 04:00:19 | 2026-06-22 05:00:19 | Claude | (aggregate) | (aggregate) | 0 | 0 | 0 | 0 | 0 | no-activity | |
| 2026-06-22 06:00:20 | 2026-06-22 05:00:20 | 2026-06-22 06:00:20 | Codex | (aggregate) | (aggregate) | 0 | 0 | 0 | 0 | 0 | no-activity | |
| 2026-06-22 06:00:20 | 2026-06-22 05:00:20 | 2026-06-22 06:00:20 | Claude | (aggregate) | (aggregate) | 0 | 0 | 0 | 0 | 0 | no-activity | |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Codex | 019ee18f-b082-7e82-89c5-47498b9ec97e | AI Engineer (Bea) | 0 | 0 | 0 | 0 | 1400 | estimate-visible | visible-message estimate |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Codex | 019ee143-3f32-7093-9a24-acd3558fc52e | Release Manager (Reid) | 0 | 0 | 0 | 0 | 2500 | estimate-visible | visible-message estimate |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Codex | 019eed9b-cb80-7311-989f-2bbc95605d8b | Web Manager (Liz) | 0 | 0 | 0 | 0 | 5500 | estimate-visible | visible-message estimate |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Codex | 019eec2c-bb6b-7b03-8c97-f73cf63dc7a8 | Autonomy Engineer (Tess) | 0 | 0 | 0 | 0 | 800 | estimate-visible | visible-message estimate |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Claude | 0e2d4c13-cd6d-4ec4-abff-4c91d1201354 | C:\Users\scott\Code\mojo | 34 | 5013 | 41732 | 175763 | 222542 | exact | |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Claude | 1d58bec8-6729-4483-a3b4-853e8da6591b | C:\Users\scott\Code\mojo | 66 | 4375 | 42434 | 425616 | 472491 | exact | |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Claude | 24404682-c97b-4f66-a243-4f1b9808b1c7 | C:\Users\scott\Code\mojo | 50 | 8265 | 54681 | 341649 | 404645 | exact | |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Claude | 4af34e71-08d0-4103-bcba-dcc2b0dfa022 | C:\Users\scott\Code\mojo | 98 | 2130 | 31674 | 556026 | 589928 | exact | |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Claude | 60b902be-57ff-421c-adc5-35df1d32cbb6 | C:\Users\scott\Code\mojo | 34 | 2530 | 42499 | 176654 | 221717 | exact | |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Claude | 94189610-3bd7-4814-8c85-82e9f509857f | C:\Users\scott\Code\mojo | 1221 | 17118 | 63004 | 1899459 | 1980802 | exact | largest session |
| 2026-06-22 07:00:27 | 2026-06-22 06:00:27 | 2026-06-22 07:00:27 | Claude | c5da8250-5015-4ef4-ab28-16917914702d | C:\Users\scott\Code\mojo | 1542 | 5595 | 43457 | 301951 | 352545 | exact | |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Codex | 019eed9b-cb80-7311-989f-2bbc95605d8b | Web Manager (Liz) | 0 | 0 | 0 | 0 | 4500 | estimate-visible | visible-message estimate |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Codex | 019ee143-3f32-7093-9a24-acd3558fc52e | Release Manager (Reid) | 0 | 0 | 0 | 0 | 3000 | estimate-visible | visible-message estimate |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Codex | 019ee18f-b082-7e82-89c5-47498b9ec97e | AI Engineer (Bea) | 0 | 0 | 0 | 0 | 900 | estimate-visible | visible-message estimate |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Codex | 019eec2c-bb6b-7b03-8c97-f73cf63dc7a8 | Autonomy Engineer (Tess) | 0 | 0 | 0 | 0 | 1000 | estimate-visible | visible-message estimate |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Codex | 019ee0cf-d067-7e60-92ae-41ea66a75746 | AI Architect (Vik) | 0 | 0 | 0 | 0 | 200 | estimate-visible | visible-message estimate |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Codex | 019eed17-7348-7593-b2ae-661027ba9cb2 | Staff Writer (June) | 0 | 0 | 0 | 0 | 350 | estimate-visible | visible-message estimate |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Claude | 18137ef2-780a-45a2-8c92-e9660e6d7917 | C:\Users\scott\Code\mojo | 34 | 3545 | 44244 | 185155 | 232978 | exact | |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Claude | 63878cd2-72e7-4694-a652-559ecf818e3d | C:\Users\scott\Code\mojo | 42 | 3474 | 39857 | 230207 | 273580 | exact | |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Claude | c991713c-a5d5-42f8-a9e0-490039df1dc6 | C:\Users\scott\Code\mojo | 2342 | 4740 | 49134 | 247808 | 304024 | exact | |
| 2026-06-22 08:00:28 | 2026-06-22 07:00:28 | 2026-06-22 08:00:28 | Claude | d2c2bd88-174f-4ca2-9598-8f71bc1e809a | C:\Users\scott\Code\mojo | 1062 | 10019 | 51788 | 1136807 | 1199676 | exact | |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | 2b9b3466-c599-46f2-9a22-5fea2b459f52 | C:\Users\scott\Code\Aesop\.claude\worktrees\serene-wright-229541 | 4066 | 3309 | 158467 | 538225 | 704067 | exact-local-jsonl | exact Claude JSONL usage sum; 10 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | 207833d3-318d-4fdc-96b6-034d1aea9490 | C:\Users\scott\Code\mindshare | 52 | 3394 | 69056 | 226480 | 298982 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | 3c16a82c-dccc-40cd-a837-4761612690de | C:\Users\scott\Code\mindshare | 70 | 5239 | 97561 | 287683 | 390553 | exact-local-jsonl | exact Claude JSONL usage sum; 8 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | 4a224939-6351-403c-9d5f-e4e5d5d5eef8 | C:\Users\scott\Code\mindshare | 52 | 2550 | 64834 | 225506 | 292942 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | 9a0e5ecd-22ab-4493-b964-0e04afb69c79 | C:\Users\scott\Code\mindshare | 52 | 3038 | 65650 | 225336 | 294076 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | a5a51777-a385-4a55-b82b-afcc5b492c0b | C:\Users\scott\Code\mindshare | 52 | 2700 | 66118 | 224658 | 293528 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | a8244962-31f0-4684-a4ea-86cf8126f7f4 | C:\Users\scott\Code\mindshare | 116 | 6546 | 76138 | 680330 | 763130 | exact-local-jsonl | exact Claude JSONL usage sum; 14 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | bda9c02d-8ed0-4641-839c-6b432161791d | C:\Users\scott\Code\mindshare | 76 | 5988 | 74934 | 392938 | 473936 | exact-local-jsonl | exact Claude JSONL usage sum; 9 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | d4b16dd1-9456-4dbc-8e5a-d18dade948c6 | C:\Users\scott\Code\mindshare | 52 | 3306 | 65714 | 225068 | 294140 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | dcd7680d-2ea6-4a2b-b896-fb5e2e8d75fd | C:\Users\scott\Code\mindshare | 52 | 3914 | 66012 | 224752 | 294730 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | f24239f7-2db2-41eb-95bc-e1f99a1517c6 | C:\Users\scott\Code\mindshare | 52 | 2690 | 66854 | 226980 | 296576 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | f9ee1048-9429-44aa-84f7-523a8a30d0e8 | C:\Users\scott\Code\mindshare | 52 | 3374 | 66644 | 226704 | 296774 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | 13b28850-be60-492f-9c62-bdfcb0dc3b73 | C:\Users\scott\Code\mojo | 88 | 14921 | 102307 | 557140 | 674456 | exact-local-jsonl | exact Claude JSONL usage sum; 12 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | a73ba60b-8ed0-4a98-b8fb-c937100cdada | C:\Users\scott\Code\mojo | 90 | 29957 | 118441 | 541439 | 689927 | exact-local-jsonl | exact Claude JSONL usage sum; 12 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | a9b570d4-2a67-483b-9404-aa1402ab6f20 | C:\Users\scott\Code\mojo | 46 | 1098 | 53666 | 208262 | 263072 | exact-local-jsonl | exact Claude JSONL usage sum; 6 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | b8d0d386-7dc9-48df-b316-4ce56fd1b11a | C:\Users\scott\Code\mojo | 53 | 27551 | 91882 | 263833 | 383319 | exact-local-jsonl | exact Claude JSONL usage sum; 7 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Claude | e92015f3-ca5b-4ba9-98ce-80fe448ccfb5 | C:\Users\scott\Code\mojo | 83 | 5868 | 108139 | 443912 | 558002 | exact-local-jsonl | exact Claude JSONL usage sum; 11 usage records |
| 2026-06-22 09:08:23 | 2026-06-22 08:00:00 | 2026-06-22 09:00:00 | Codex | 019eec2c-bb6b-7b03-8c97-f73cf63dc7a8 | C:\Users\scott\Code\mindshare | 1243490 | 4944 | 0 | 1054848 | 1248434 | exact-local-jsonl-delta | exact Codex total_token_usage delta; 7 token_count snapshots; cache_create unavailable |
| 2026-06-22 10:09:54 | 2026-06-22 09:00:00 | 2026-06-22 10:00:00 | Codex | 019ee0cf-d067-7e60-92ae-41ea66a75746 | C:\Users\scott\Code\mojo | 92193 | 339 | 0 | 49408 | 92532 | exact-local-jsonl-delta | exact Codex total_token_usage delta; 2 token_count snapshots; cache_create unavailable |
| 2026-06-22 10:09:54 | 2026-06-22 09:00:00 | 2026-06-22 10:00:00 | Codex | 019eedc7-9e34-78c2-9792-5e8c1787fd46 | C:\Users\scott\Code\mojo | 353954 | 1019 | 0 | 249472 | 354973 | exact-local-jsonl-delta | exact Codex total_token_usage delta; 3 token_count snapshots; cache_create unavailable |
| 2026-06-22 11:09:25 | 2026-06-22 10:00:00 | 2026-06-22 11:00:00 | Codex | 019eedc7-9e34-78c2-9792-5e8c1787fd46 | C:\Users\scott\Code\mojo | 378470 | 1027 | 0 | 358528 | 379497 | exact-local-jsonl-delta | exact Codex total_token_usage delta; 3 token_count snapshots; cache_create unavailable |
