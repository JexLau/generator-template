## 中控表格增删查改

1. 生成表格时，以下数据来源是mixin的base_view，不需要处理。base-table版本只需要传columns, apiModuleName, edit_click, delete_click。

```
total: 0,
page: 1,
perpage: 20,
@change_perpage
@change_page
```