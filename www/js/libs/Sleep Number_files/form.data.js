function mmPopulateForms(form){
	var forms = {
		'#checkout-billing-shipping':{
			'billingAddress.contactForm.firstName':'Test',
			'billingAddress.contactForm.lastName':'MadMobile',
			'billingAddress.contactForm.addressLine1':'123 Test Drive',
			'billingAddress.contactForm.addressLine2':'',
			'billingAddress.contactForm.city':'Tampa',
			'billingAddress.contactForm.state':'US-FL',
			'billingAddress.contactForm.postalCode':'33607',
			'emailAddress':'nroney@madmobile.com',
			'billingAddress.contactForm.country': 'US',
			'billing-display-phone': '5555555555'
		},
		'#checkout-payment':{
			'i4Go_CardNumber':'4111-1111-1111-1111',
			'i4Go_ExpirationMonth':'2',
			'i4Go_ExpirationYear':'2018',
			'i4Go_CVV2Code':'121',
			'cardTypes': 'visa'
		},
		'#contact-form':{
			'reason': 'MyOnlineOrder',
			'first_name': 'Scott',
			'last_name': 'Tester',
			'email': 'test@madmobile.com',
			'vemail': 'test@madmobile.com',
			'dayphone': '5555555555',
			'message': 'This is a test from mad mobile'
		},
		'#lead-generation': {
			'firstName': 'Test',
			'lastName': 'MadMobile',
			'address': '1715 N WESTSHORE BLVD',
			'address2': 'Suite #600',
			'city': 'Tampa',
			'state': 'US-FL',
			'postalCode': '33607',
			'email': 'nroney@madmobile.com',
			'confirmEmail': 'nroney@madmobile.com',
			'phone': '5555555555'
		}
	};
	for(var formKey in forms){
		form = forms[formKey];
		var $form = $(formKey);
		for(var inputKey in form){
			$form.find('[name="'+inputKey+'"]').val(form[inputKey]);
			console.log('[name="'+inputKey+'"]',form[inputKey]);
		}
	}
}