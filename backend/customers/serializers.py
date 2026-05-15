from rest_framework import serializers

from .models import Customer


class CustomerListSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Customer

        fields = [
            "id",
            "customer_code",
            "name",
            "state",
            "customer_type",
            "billing_gst_number",
            "is_active",
        ]

class CustomerDetailSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Customer

        fields = "__all__"


class CustomerCreateUpdateSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Customer

        fields = [
            "customer_code",
            "name",
            "billing_address",
            "billing_gst_number",
            "shipping_address",
            "shipping_gst_number",
            "state",
            "contact_numbers",
            "contact_emails",
            "credit_terms",
            "pan_number",
            "customer_type",
            "is_active",
        ]
    def validate(
        self,
        attrs
    ):

        billing_gst_number = attrs.get(
                "billing_gst_number"
            )

        if billing_gst_number:

            existing_customer = (
                Customer.objects.filter(
                    billing_gst_number=
                        billing_gst_number
                )
            )

            # Exclude self during update

            if self.instance:

                existing_customer = (
                    existing_customer.exclude(
                        id=self.instance.id
                    )
                )

            if existing_customer.exists():

                raise serializers.ValidationError(
                    {
                        "billing_gst_number":
                        (
                            "Customer with this GST "
                            "already exists."
                        )
                    }
                )

        return attrs   
