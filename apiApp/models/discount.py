from django.db import models

class Discount(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)  # optional but useful
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2)
    products = models.ManyToManyField("Product", related_name="discounts")
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name or f"{self.discount_percent}% off"