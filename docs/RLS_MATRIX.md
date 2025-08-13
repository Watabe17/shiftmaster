# RLSアクセスマトリクス（要点）

| テーブル | 従業員 | 管理者 | system_admin |
|---|---|---|---|
| profiles | 自分のみ参照/更新 | 同店舗参照/更新 | 全店参照 |
| shift_requests | 自分のみCRUD | 同店舗参照 | 全店参照 |
| shifts | 自分の確定分参照 | CRUD | 全店参照 |
| attendances | 自分参照（将来:自己申請） | CRUD | 全店参照 |
| rule_sets/* | 参照 | CRUD | 全店参照 |
| shop_settings/positions/break_rules | 参照 | CRUD | 全店参照 |
| invitations | - | CRUD | 全店参照 |

サンプルポリシー（概略）:
```sql
create policy "select own requests" on shift_requests for select using (auth.uid() = user_id);
create policy "upsert own requests" on shift_requests for insert with check (auth.uid() = user_id);
create policy "update own requests" on shift_requests for update using (auth.uid() = user_id);
```
