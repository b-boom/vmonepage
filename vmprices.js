if(typeof Virtuemart === "undefined")

		var Virtuemart = {};
		
			Virtuemart.setproducttype =  function (form, id) {
				form.view = null;
				var $ = jQuery, datas = form.serialize();
				var prices = form.parent(".productdetails").find(".product-price");
				if (0 == prices.length) {
					prices = $("#productPrice" + id);
				}
				datas = datas.replace("&view=cart", "");
				prices.fadeTo("fast", 0.75);
				
		 jQuery.ajax({
        	type: "POST",
	        cache: false,
	        dataType: "json",
    	    url: window.vmSiteurl + "index.php?&option=com_virtuemart&view=productdetails&task=recalculate&format=json&nosef=1" + window.vmLang,
        	data: datas
	       }).done(
					function (data, textStatus) 
					{
						prices.fadeTo("fast", 1);
						// refresh price
						for (var key in data) {
							var value = data[key];
							
							 if ( key=='messages' )
							 {
				                    var newmessages = jQuery( data[key] ).find("div.alert").addClass("vmprices-message");
               					    if (!jQuery( "#system-message-container #system-message").length && newmessages.length) 
									{
			                            jQuery( "#system-message-container" ).append( "<div id='system-message'></div>" );
           				      		}
                   		  	        newmessages.appendTo( "#system-message-container #system-message");
			                } else { // prices
            				        if (value!=0) prices.find("span.Price"+key).show().html(value);
				                    else prices.find(".Price"+key).html(0).hide();
                			}
						}
					});
				return false; // prevent reload
			}
			Virtuemart.removeproduct=function(productid){
				var $ = jQuery ;
				$.ajaxSetup({ cache: false })
				$.getJSON("index.php?type=deleteprod&nosef=1&view=cart&task=viewJS&productid="+productid+"&format=json"+window.vmLang,
					function(datas, textStatus) {
						  if ($(".vmCartModule")[0]) {
                       		 Virtuemart.productUpdate($(".vmCartModule"));
                         }
						 if(window.CARTPAGE == "yes")
						 {
							 window.location.reload(); 
						 }
					}
				);
			}
			Virtuemart.productUpdate =function(mod) {

				var $ = jQuery ;
				$.ajaxSetup({ cache: false })
				$.getJSON("index.php?type=onepages&nosef=1&view=cart&task=viewJS&format=json"+window.vmLang,
					function(datas, textStatus) {
						if (datas.totalProduct >0) {
							//add primary class in add to cart button
							jQuery('0vmCartModule .uk-button').addClass('uk-button-primary');
							mod.find(".vm_cart_products").html("");
							mod.find(".vm_cart_products1").html("");
							
							$.each(datas.products, function(key, val) {
								$(".hiddencontainer:first .container").clone().appendTo(".vmCartModule .vm_cart_products");
								$(".mcart:first .container").clone().appendTo(".vmCartModule .vm_cart_products1");
								$.each(val, function(key, val) {
									if(key == 'product_name'){
									  new_link = '<a title="'+$(val).html()+'" href="'+$(val).attr('href')+'">'+$(val).html().substr(0, 28);
									if($(val).html().length > 28) new_link+= '...';
									  new_link+= '</a>';
									if ($("#hiddencontainer .container ."+key)) mod.find(".vm_cart_products ."+key+":last").html(new_link) ;										
									if ($("#mcart .container ."+key)) mod.find(".vm_cart_products1 ."+key+":last").html(new_link) ;
									}else{
										if ($("#hiddencontainer .container ."+key)) mod.find(".vm_cart_products ."+key+":last").html(val) ;										
										if ($("#mcart .container ."+key)) mod.find(".vm_cart_products1 ."+key+":last").html(val) ;
									}
								});
							});
							mod.find(".total").html(datas.billTotal.replace("Total :", ""));
							new_cart = '<a href="'+$(datas.cart_show).attr('href')+'"';
							new_cart+= ' class="uk-button uk-button-primary">'
							new_cart+= '<i class="uk-icon-shopping-cart"></i> '+$(datas.cart_show).html()+'</a>';
							//mod.find(".show_cart").html(datas.cart_show);


							mod.find(".show_cart").html(new_cart);
							mod.find(".uk-button-group button").addClass("uk-button-primary");
							mod.find(".uk-button-group a.uk-button").addClass("uk-button-primary");
						}
						else
						{
						  mod.find(".total").html(datas.billTotal);	 
						  mod.find(".vm_cart_products").html("");
						  mod.find(".vm_cart_products1").html("");	 
						  new_cart  = '<hr class="uk-margin-small">'+datas.emptymsg;	 
						  mod.find(".show_cart").html(new_cart);
						  mod.find(".uk-button-group button").removeClass("uk-button-primary");
						  mod.find(".uk-button-group a.uk-button").removeClass("uk-button-primary");
						}
						mod.find(".total_products").html(datas.totalProductTxt);
					}
					
					
				);
			}
			Virtuemart.sendtocart =  function (form){

				if (Virtuemart.addtocart_popup ==1) {
					Virtuemart.cartEffect(form) ;
				} else {
					form.append('<input type="hidden" name="task" value="add" />');
					form.submit();
				}
			}
			Virtuemart.cartEffect = function(form) {

                var $ = jQuery ;
                $.ajaxSetup({ cache: false });
                var datas = form.serialize();

                if(usefancy){
                    $.fancybox.showActivity(); 
                }
				if(document.addtocartalert == 1)
				{
				  datas= datas+"&releated=no";		 
				}
				else
				{
				  datas= datas+"&releated=yes";		 
				}
				
				

				//var modal = new $.UIkit.modal.Modal("#add_to_cart_popup");
				//var modal = new $.UIkit.modal("#add_to_cart_popup");
                $.getJSON(vmSiteurl+'index.php?option=com_virtuemart&nosef=1&view=cart&task=addJS&format=json'+vmLang,datas,
                function(datas, textStatus) {
                    if(datas.stat ==1){
                        var txt = datas.msg;
                    } else if(datas.stat ==2){
                        var txt = datas.msg +"<H4>"+form.find(".pname").val()+"</H4>";
                    } else {
                        var txt = "<H4>"+vmCartError+"</H4>"+datas.msg;
                    }
					plaintext = "";
					if(document.addtocartalert == 1) //check addcart function from popup
					{
						 plaintext = jQuery(txt).text();
						 plaintext = plaintext.replace("/", "");
						 plaintext = plaintext.replace("/", "");
						 
						 carthtmltxt = '<div class="uk-alert" data-uk-alert><a href="/" class="uk-alert-close uk-close"></a><p>'+plaintext+'</p></div>';
						 jQuery("#cartalert").html(carthtmltxt);
						 document.addtocartalert = 0;
					} 
					else
					{
	                    if(usefancy){
							
							if(window.CARTPAGE == "yes")
							 {
								 window.location.reload(); 
							 }
							 else
							 {
	    	                    $.fancybox({
        	                        "titlePosition" : 	"inside",
            	                    "transitionIn"	:	"fade",
                	                "transitionOut"	:	"fade",
                    	            "changeFade"    :   "fast",
                            	    "type"			:	"html",
                        	        "autoCenter"    :   true,
                                	"closeBtn"      :   false,
	                                "closeClick"    :   false,
	                                "content"       :   txt
    	                         }
        	                   );
							 }
	                    } else {
							jQuery('#add_to_cart_popup .inner-content').html(txt);
							if(window.CARTPAGE == "yes")
							 {
								 window.location.reload(); 
							 }
							 else
							 {
								jQuery( "#addtocart_popup_button" ).click();
							 }
						
	                    }
					}

                    if ($(".vmCartModule")[0]) {
                        Virtuemart.productUpdate($(".vmCartModule"));
                    }
                });

                $.ajaxSetup({ cache: true });
			}

			Virtuemart.product =  function(carts) {

				
				carts.each(function(){
					var cart = jQuery(this),
					step=cart.find('input[name="quantity"]'),
					addtocart = cart.find('.addtocart-button'),
					plus   = cart.find('.quantity-plus'),
					minus  = cart.find('.quantity-minus'),
					select = cart.find('select:not(.no-vm-bind)'),
					radio = cart.find('input:radio:not(.no-vm-bind)'),
					virtuemart_product_id = cart.find('input[name="virtuemart_product_id[]"]').val(),
					quantity = cart.find('.quantity-input');
					

                    var Ste = parseInt(step.val());
                    //Fallback for layouts lower than 2.0.18b
                    if(isNaN(Ste)){
                        Ste = 1;
                    }
					addtocart.unbind( "click" );
					addtocart.click(function(e) { 
						Virtuemart.sendtocart(cart);
						return false;
					});
					plus.unbind( "click" );
					plus.click(function() {
						var Qtt = parseInt(quantity.val());
						if (!isNaN(Qtt)) {
							quantity.val(Qtt + Ste);
						Virtuemart.setproducttype(cart,virtuemart_product_id);
						}
						
					});
					minus.unbind( "click" );
					minus.click(function() {
						var Qtt = parseInt(quantity.val());
						if (!isNaN(Qtt) && Qtt>Ste) {
							quantity.val(Qtt - Ste);
						} else quantity.val(Ste);
						Virtuemart.setproducttype(cart,virtuemart_product_id);
					});
					
					select.change(function() {
						Virtuemart.setproducttype(cart,virtuemart_product_id);
					});
					radio.change(function() {
						Virtuemart.setproducttype(cart,virtuemart_product_id);
					});
					quantity.keyup(function() {
						Virtuemart.setproducttype(cart,virtuemart_product_id);
					});
				});

			}

		jQuery.noConflict();
		jQuery(document).ready(function($) {

			Virtuemart.product($("form.product"));

			$("form.js-recalculate").each(function(){
				if ($(this).find(".product-fields").length && !$(this).find(".no-vm-bind").length) {
					var id= $(this).find('input[name="virtuemart_product_id[]"]').val();
					Virtuemart.setproducttype($(this),id);

				}
			});
		});

