from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0002_userprofile"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="existing_investments",
            field=models.TextField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="investment_amount",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=18,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="investment_goal",
            field=models.TextField(blank=True, max_length=300),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="monthly_contribution",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=18,
                null=True,
            ),
        ),
        migrations.AddConstraint(
            model_name="userprofile",
            constraint=models.CheckConstraint(
                condition=models.Q(("investment_amount__gte", 0)),
                name="profile_investment_amount_nonnegative",
            ),
        ),
        migrations.AddConstraint(
            model_name="userprofile",
            constraint=models.CheckConstraint(
                condition=models.Q(("monthly_contribution__gte", 0)),
                name="profile_monthly_contribution_nonnegative",
            ),
        ),
    ]
